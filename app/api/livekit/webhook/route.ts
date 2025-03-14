import { markAppointmentComplete, sendEmailAction } from "@/lib/actions";
import {
	WebhookEvent,
	WebhookEventNames,
	WebhookReceiver,
} from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { Appointment as AppointmentType } from "@/lib/definitions";
import {
	EmailTemplateParams,
	generateConsultationCompletedEmail,
	generateConsultationConfirmationEmail,
	generateThankYouEmail,
} from "@/lib/emails";
import Appointment from "@/models/Appointment";

const receiver = new WebhookReceiver(
	process.env.LIVEKIT_API_KEY as string,
	process.env.LIVEKIT_API_SECRET as string
);

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const authHeader = req.headers.get("authorization");
		if (!authHeader) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Parse webhook event
		const event = await receiver.receive(await req.text(), authHeader);
		console.log("event", event);

		// Log event and process participant/room events
		await handleParticipantEvents(event);

		if (event.event === "room_finished") {
			// Check if both participants joined and stayed for the required time before completing
			const appointmentId = event?.room?.metadata as string;
			const appointment = await Appointment.findById(appointmentId);

			if (appointment && isConsultationValid(appointment.logs)) {
				await completeAppointment(appointmentId);
			} else {
				// Send emails for confirmation if the consultation wasn't valid
				await sendConfirmationEmails(appointmentId);
			}
		}
		return NextResponse.json(
			{ message: "Webhook received", event },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error processing webhook:", error);
		return NextResponse.json(
			{ error: "Webhook handling failed", details: error.message },
			{ status: 500 }
		);
	}
}

/**
 * Checks if the consultation was valid based on logs
 * @param logs Array of logs from the appointment
 * @returns boolean indicating if consultation was valid
 */
const isConsultationValid = (logs: any[]) => {
	if (!logs || logs.length === 0) return false;

	// Check if both doctor and patient joined at least once
	const doctorJoined = logs.some(
		(log) => log.action === "Participant_joined" && log.role === "doctor"
	);
	const patientJoined = logs.some(
		(log) => log.action === "Participant_joined" && log.role === "patient"
	);

	if (!doctorJoined || !patientJoined) return false;

	// Calculate total duration for each participant across all join/leave events
	const minDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

	// Get all join/leave events for each role, sorted by date
	const doctorEvents = logs
		.filter(
			(log) =>
				(log.action === "Participant_joined" ||
					log.action === "Participant_left") &&
				log.role === "doctor"
		)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	const patientEvents = logs
		.filter(
			(log) =>
				(log.action === "Participant_joined" ||
					log.action === "Participant_left") &&
				log.role === "patient"
		)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	// Calculate total time spent in the call for doctor
	let doctorTotalDuration = 0;
	let doctorLastJoin: any = null;

	for (const event of doctorEvents) {
		if (event.action === "Participant_joined") {
			doctorLastJoin = event;
		} else if (event.action === "Participant_left" && doctorLastJoin) {
			// Calculate duration for this session
			const sessionDuration =
				new Date(event.date).getTime() -
				new Date(doctorLastJoin.date).getTime();
			doctorTotalDuration += sessionDuration;
			doctorLastJoin = null;
		}
	}

	// If doctor joined but didn't leave (e.g., still in the call when room finished)
	if (doctorLastJoin) {
		const roomFinishedLog = logs.find((log) => log.action === "room_finished");
		if (roomFinishedLog) {
			const sessionDuration =
				new Date(roomFinishedLog.date).getTime() -
				new Date(doctorLastJoin.date).getTime();
			doctorTotalDuration += sessionDuration;
		} else {
			// If no room_finished event, consider they're still in call
			doctorTotalDuration += Infinity;
		}
	}

	// Calculate total time spent in the call for patient
	let patientTotalDuration = 0;
	let patientLastJoin: any = null;

	for (const event of patientEvents) {
		if (event.action === "Participant_joined") {
			patientLastJoin = event;
		} else if (event.action === "Participant_left" && patientLastJoin) {
			// Calculate duration for this session
			const sessionDuration =
				new Date(event.date).getTime() -
				new Date(patientLastJoin.date).getTime();
			patientTotalDuration += sessionDuration;
			patientLastJoin = null;
		}
	}

	// If patient joined but didn't leave (e.g., still in the call when room finished)
	if (patientLastJoin) {
		const roomFinishedLog = logs.find((log) => log.action === "room_finished");
		if (roomFinishedLog) {
			const sessionDuration =
				new Date(roomFinishedLog.date).getTime() -
				new Date(patientLastJoin.date).getTime();
			patientTotalDuration += sessionDuration;
		} else {
			// If no room_finished event, consider they're still in call
			patientTotalDuration += Infinity;
		}
	}

	// For debugging
	console.log(
		`Doctor total duration: ${doctorTotalDuration}ms, Patient total duration: ${patientTotalDuration}ms, Required: ${minDuration}ms`
	);

	return (
		doctorTotalDuration >= minDuration && patientTotalDuration >= minDuration
	);
};

/**
 * Send confirmation emails when the consultation wasn't valid
 */
const sendConfirmationEmails = async (appointmentId: string) => {
	try {
		const appointment = await Appointment.findById(appointmentId).populate(
			"doctor patient"
		);
		if (!appointment) return;

		// Template params for emails
		const params = {
			doctorName: appointment?.doctor?.name as string,
			patientName: appointment?.patient?.name as string,
			reportIssueLink: `${process.env.NEXT_PUBLIC_HOSTNAME}/report-issue`,
			supportEmail: "addawebadua@gmail.com",
			isForDoctor: false,
		} satisfies EmailTemplateParams;

		const doctorParams = {
			...params,
			isForDoctor: true,
		} satisfies EmailTemplateParams;
		const patientEmail = generateConsultationConfirmationEmail(params);
		const doctorEmail = generateConsultationConfirmationEmail(doctorParams);

		// Send confirmation emails to doctor and patient
		await sendEmailAction(
			"email",
			appointment?.patient?.email as string,
			"Please confirm your consultation completion",
			patientEmail
		);

		await sendEmailAction(
			"email",
			appointment?.doctor?.email as string,
			"Please confirm consultation completion",
			doctorEmail
		);
	} catch (error) {
		console.error("Error sending confirmation emails:", error);
	}
};

/**
 * Completes the appointment and sends thank you emails
 */
const completeAppointment = async (appointmentId: string) => {
	try {
		const res = await markAppointmentComplete(appointmentId);
		if ("data" in res) {
			const appointment: AppointmentType = res?.data;
			const params = {
				doctorName: appointment?.doctor?.name as string,
				patientName: appointment?.patient?.name as string,
				reviewLink: `${process.env.NEXT_PUBLIC_HOSTNAME}/consultation/review/${appointment?.id}`,
				reportIssueLink: `${process.env.NEXT_PUBLIC_HOSTNAME}/report-issue`,
				supportEmail: "addawebadua@gmail.com",
				isForDoctor: false,
			} satisfies EmailTemplateParams;
			const doctorParams = {
				...params,
				isForDoctor: true,
			} satisfies EmailTemplateParams;
			const thankyouPatient = generateConsultationCompletedEmail(params);
			const thankyoudoctor = generateConsultationCompletedEmail(doctorParams);

			// Send thank you emails
			await Promise.all([
				sendEmailAction(
					"email",
					appointment?.patient?.email as string,
					"Thank you for choosing Medcare Hub",
					thankyouPatient
				),
				sendEmailAction(
					"email",
					appointment?.doctor?.email as string,
					"Medcare Hub thanks you",
					thankyoudoctor
				),
			]);
		}
	} catch (error) {
		console.error("Error completing appointment:", error);
	}
};

/**
 * @param event this is the event sent by the webhook
 * @returns void
 */
const handleParticipantEvents = async (event: WebhookEvent) => {
	const appointment = await Appointment.findById(event?.room?.metadata);
	if (!appointment) {
		return;
	}

	switch (event.event) {
		case "room_started":
			appointment.logs.push({
				action: "room_started",
				date: new Date(),
			});
			break;
		case "participant_joined":
			appointment.logs.push({
				action: "Participant_joined",
				date: new Date(),
				userId: event.participant?.attributes.user_id as string,
				role: event.participant?.attributes.role as string,
			});
			break;
		case "participant_left":
			appointment.logs.push({
				action: "Participant_left",
				date: new Date(),
				userId: event.participant?.attributes.user_id as string,
				role: event.participant?.attributes.role as string,
				disconnect_reason: event.participant?.disconnectReason,
			});
			break;
		case "room_finished":
			appointment.logs.push({
				action: "room_finished",
				date: new Date(),
			});
			break;
	}

	// Save the updated logs to the database
	await appointment.save();
};
