// app/api/paystack/verify/webhook/route.ts
import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { handleSuccessfulPayment } from "@/app/api/utils/handlepaymentsucess";
import { sendEmail } from "../../utils/email";
import moment from "moment";
import { Appointment, ErrorReturn, SuccessReturn } from "@/lib/definitions";
import {
	appointmentConfirmPatient,
	doctorAppointmentEmail,
	appointmentUpcomingReminder,
	doctorUpcomingAppointmentReminder,
} from "@/lib/emails";
import { sendEmailAction } from "@/lib/actions";
import { Client } from "@upstash/qstash";
import { parseISO, subMinutes, format } from "date-fns";

const qstashClient = new Client({ token: process.env.QSTASH_TOKEN as string });
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;
function verifySignature(body: string, signature: string): boolean {
	const hash = createHmac("sha512", PAYSTACK_SECRET_KEY)
		.update(body)
		.digest("hex");
	return hash === signature;
}

// Helper function to schedule appointment reminders
async function scheduleAppointmentReminders(appointment: Appointment) {
	try {
		const startTime = parseISO(appointment?.timeSlot?.startTime);
		const formattedDate = format(startTime, "PPP");
		const formattedTime = format(startTime, "p");
		const consultationUrl = `https://medcare-hub.vercel.app/consultation/${appointment.id}`;

		// Schedule 10-minute reminder for patient
		const tenMinsBefore = subMinutes(startTime, 10);
		// Schedule 1-minute reminder for patient
		const oneMinBefore = subMinutes(startTime, 1);
		await Promise.all([
			sendEmailAction(
				"email",
				appointment.patient.email,
				"Reminder: Upcoming Appointment In 10 Minutes",
				appointmentUpcomingReminder(
					appointment.doctor.name!,
					appointment.patient.name,
					formattedDate,
					formattedTime,
					"10 minutes",
					consultationUrl
				),
				Math.max(0, tenMinsBefore.getTime() - Date.now())
			),
			sendEmailAction(
				"email",
				appointment.patient.email,
				"Reminder: Appointment starts now",
				appointmentUpcomingReminder(
					appointment.doctor.name!,
					appointment.patient.name,
					formattedDate,
					formattedTime,
					"1 minute",
					consultationUrl
				),
				Math.max(0, oneMinBefore.getTime() - Date.now())
			),
			sendEmailAction(
				"email",
				appointment.doctor.email!,
				"Reminder: Upcoming Appointment In 10 Minutes",
				doctorUpcomingAppointmentReminder(
					appointment.doctor.name!,
					appointment.patient.name,
					formattedDate,
					formattedTime,
					"10 minutes",
					consultationUrl
				),
				Math.max(0, tenMinsBefore.getTime() - Date.now())
			),
			sendEmailAction(
				"email",
				appointment.doctor.email!,
				"Appointment starts: Please join your consultation",
				doctorUpcomingAppointmentReminder(
					appointment.doctor.name!,
					appointment.patient.name,
					formattedDate,
					formattedTime,
					"1 minute",
					consultationUrl
				),
				Math.max(0, oneMinBefore.getTime() - Date.now())
			),
		]);

		await qstashClient.publishJSON({
			url: "https://medcare-hub.vercel.app/api/jobs/appointment-reminder",
			body: {
				recipient: appointment.patient.email,
				subject: "Your Appointment Is Starting Soon",
				body: appointmentUpcomingReminder(
					appointment.doctor.name!,
					appointment.patient.name,
					formattedDate,
					formattedTime,
					"1 minute",
					consultationUrl
				),
				doctorName: appointment.doctor.name,
				patientName: appointment.patient.name,
				appointmentTime: formattedTime,
				timeUntil: "1 minute",
			},
			delay: Math.max(0, oneMinBefore.getTime() - Date.now()),
		});

		// Schedule 1-minute reminder for doctor
		await qstashClient.publishJSON({
			url: "https://medcare-hub.vercel.app/api/jobs/appointment-reminder",
			body: {
				recipient: appointment.doctor.email,
				subject: "Your Appointment Is Starting Soon",
				body: doctorUpcomingAppointmentReminder(
					appointment.doctor.name!,
					appointment.patient.name,
					formattedDate,
					formattedTime,
					"1 minute",
					consultationUrl
				),
				doctorName: appointment.doctor.name,
				patientName: appointment.patient.name,
				appointmentTime: formattedTime,
				timeUntil: "1 minute",
			},
			delay: Math.max(0, oneMinBefore.getTime() - Date.now()),
		});

		console.log("Appointment reminders scheduled successfully");
		return true;
	} catch (error) {
		console.error("Error scheduling appointment reminders:", error);
		return false;
	}
}

export async function POST(req: Request): Promise<NextResponse> {
	const signature = req.headers.get("x-paystack-signature");
	const body = await req.text();

	if (!signature || !verifySignature(body, signature)) {
		console.error("Invalid signature");
		return NextResponse.json(
			{
				error: "Invalid signature",
				message: "This signature is not from paystack",
				status: "fail",
				statusCode: 403,
				type: "UnAuthorized",
			} as ErrorReturn,
			{
				status: 403,
			}
		);
	}

	NextResponse?.json(
		{ message: "Webhook received" },
		{
			status: 200,
		}
	);
	const event = JSON.parse(body);
	if (event.event === "charge.success") {
		const data = event.data;
		console.log("event", event);
		const updateappointment = await handleSuccessfulPayment(
			event?.data?.metadata?.appointment,
			data
		);
		if ("data" in updateappointment) {
			const appointment = updateappointment?.data;

			// Send confirmation emails
			await sendEmailAction(
				"email",
				event?.data?.metadata?.patient_email,
				"Appointment Confirmation",
				appointmentConfirmPatient(appointment)
			);

			await sendEmailAction(
				"email",
				event?.data?.metadata?.doctor_email,
				"Appointment Confirmation",
				doctorAppointmentEmail(
					appointment?.doctor?.name,
					appointment?.patient?.name,
					moment(appointment?.date).format("dddd, MMMM Do YYYY"),
					moment(appointment?.date).format("hh:mm A")
				)
			);

			// Schedule appointment reminders
			await scheduleAppointmentReminders(appointment);

			return NextResponse.json(
				{
					message: "Appointment confirmed",
					data: updateappointment?.data,
					status: "success",
					statusCode: 200,
				} as SuccessReturn,
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{
					error: updateappointment?.error,
					message: updateappointment?.error,
					status: updateappointment?.status,
					statusCode: updateappointment?.statusCode,
					type: updateappointment?.type,
				} as ErrorReturn,
				{ status: 500 }
			);
		}
	} else {
		const email = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f7f6;">
          <h2 style="color: #4CAF50;">Appointment Confirmation</h2>
          <p style="font-size: 16px;">Dear ${event?.data?.metadata?.patient_name},</p>
          <p style="font-size: 16px;">Your appointment could not be confirmed.</p>
          <p style="font-size: 16px;">If you have have made a sucessful payment for this appointment kindly reply this email with you receipt number.</p>
          <p style="font-size: 16px;">Best regards,</p>
          <p style="font-size: 16px;">Medcare Hub</p>
        </div>
      `;

		await sendEmail(
			event?.data?.metadata?.patient_email,
			"Appointment Confirmation Failed",
			email
		);

		return NextResponse.json("appointment not confirmed");
	}
}
