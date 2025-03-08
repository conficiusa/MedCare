import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { sendEmail } from "../../utils/email";

export const POST = verifySignatureAppRouter(async (req: Request) => {
	try {
		const data = await req.json();
		const {
			recipient,
			subject,
			body,
			appointmentId,
			doctorName,
			doctorEmail,
			patientName,
			patientEmail,
			startTime,
			timeRemaining,
		} = data;

		// Send reminder to patient
		if (patientEmail) {
			const patientBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Appointment Reminder</h2>
          <p>Hello ${patientName},</p>
          <p>This is a reminder that your appointment with Dr. ${doctorName} is starting in <strong>${timeRemaining} minutes</strong>.</p>
          <p>Appointment time: ${startTime}</p>
          <p>Please be ready to join your consultation.</p>
          <p>Thank you for choosing MedCare.</p>
        </div>
      `;
			await sendEmail(
				patientEmail,
				`Your appointment is in ${timeRemaining} minutes`,
				patientBody
			);
		}

		// Send reminder to doctor
		if (doctorEmail) {
			const doctorBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Appointment Reminder</h2>
          <p>Hello Dr. ${doctorName},</p>
          <p>This is a reminder that your appointment with ${patientName} is starting in <strong>${timeRemaining} minutes</strong>.</p>
          <p>Appointment time: ${startTime}</p>
          <p>Please be ready to join your consultation.</p>
          <p>Thank you for using MedCare.</p>
        </div>
      `;
			await sendEmail(
				doctorEmail,
				`Your appointment is in ${timeRemaining} minutes`,
				doctorBody
			);
		}

		return new Response(
			`Appointment reminders sent successfully for appointment: ${appointmentId}`
		);
	} catch (error) {
		console.error("Error sending appointment reminder:", error);
		return new Response(`Error sending appointment reminder: ${error}`, {
			status: 500,
		});
	}
});
