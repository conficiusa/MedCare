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
	generateImmediateStartEmail,
} from "@/lib/emails";
import { sendEmailAction } from "@/lib/actions";
import { Client } from "@upstash/qstash";
import { parseISO, subMinutes, format, differenceInMinutes } from "date-fns";

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
		const now = new Date();

		// Calculate minutes remaining until the appointment
		const minutesUntilAppointment = differenceInMinutes(startTime, now);

		// Case 1: Appointment has already started or is about to start (less than 2 minutes away)
		if (minutesUntilAppointment <= 2) {
			console.log(
				"Appointment starts now or has already started - sending immediate notifications"
			);

			// Send immediate join notifications to both parties
			await Promise.all([
				sendEmailAction(
					"email",
					appointment.patient.email,
					"Your Appointment Is Ready to Join Now",
					generateImmediateStartEmail(
						appointment.doctor.name!,
						appointment.patient.name,
						formattedDate,
						formattedTime,
						consultationUrl,
						false
					)
				),
				sendEmailAction(
					"email",
					appointment.doctor.email!,
					"Your Appointment Is Ready to Join Now",
					generateImmediateStartEmail(
						appointment.doctor.name!,
						appointment.patient.name,
						formattedDate,
						formattedTime,
						consultationUrl,
						true
					)
				),
			]);

			// Return true and indicate that we've already sent emails
			return { success: true, immediateStart: true };
		}

		// Case 2: Between 2 and 15 minutes until appointment
		// Only schedule the 1-minute reminder
		if (minutesUntilAppointment > 2 && minutesUntilAppointment < 15) {
			console.log(
				"Less than 15 minutes until appointment - scheduling only 1-minute reminders"
			);

			// Schedule 1-minute reminder for patient and doctor
			const oneMinBefore = subMinutes(startTime, 1);

			await Promise.all([
				sendEmailAction(
					"email",
					appointment.patient.email,
					"Reminder: Appointment Starting Soon",
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
					"Reminder: Appointment Starting Soon",
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

			return { success: true, immediateStart: false };
		}

		// Case 3: More than 15 minutes until appointment
		// Schedule both 10-minute and 1-minute reminders
		if (minutesUntilAppointment >= 15) {
			console.log(
				"More than 15 minutes until appointment - scheduling both reminders"
			);

			const tenMinsBefore = subMinutes(startTime, 10);
			const oneMinBefore = subMinutes(startTime, 1);

			await Promise.all([
				// 10-minute reminder for patient
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
				// 1-minute reminder for patient
				sendEmailAction(
					"email",
					appointment.patient.email,
					"Reminder: Appointment Starting Soon",
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
				// 10-minute reminder for doctor
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
				// 1-minute reminder for doctor
				sendEmailAction(
					"email",
					appointment.doctor.email!,
					"Reminder: Appointment Starting Soon",
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

			return { success: true, immediateStart: false };
		}

		console.log("Appointment reminders scheduled based on time conditions");
		return { success: true, immediateStart: false };
	} catch (error) {
		console.error("Error scheduling appointment reminders:", error);
		return { success: false, immediateStart: false };
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

			// Schedule appointment reminders based on time conditions
			const reminderResult = await scheduleAppointmentReminders(appointment);

			// Only send confirmation emails if the appointment isn't starting immediately
			// to avoid sending too many emails at once
			if (!reminderResult.immediateStart) {
				// Send confirmation emails
				await Promise.all([
					sendEmailAction(
						"email",
						event?.data?.metadata?.patient_email,
						"Appointment Confirmation",
						appointmentConfirmPatient(appointment)
					),
					sendEmailAction(
						"email",
						event?.data?.metadata?.doctor_email,
						"Appointment Confirmation",
						doctorAppointmentEmail(
							appointment?.doctor?.name,
							appointment?.patient?.name,
							moment(appointment?.date).format("dddd, MMMM Do YYYY"),
							moment(appointment?.date).format("hh:mm A")
						)
					),
				]);
			}

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
