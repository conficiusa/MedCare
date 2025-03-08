import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { sendEmail } from "../../utils/email";

export const POST = verifySignatureAppRouter(async (req: Request) => {
	try {
		const data = await req.json();
		const {
			body,
			recipient,
			subject,
			doctorName,
			patientName,
			appointmentTime,
			timeUntil,
		} = data as {
			recipient: string;
			subject: string;
			body: string;
			doctorName: string;
			patientName: string;
			appointmentTime: string;
			timeUntil: string;
		};

		await sendEmail(recipient, subject, body);
		return new Response(
			`Appointment reminder email sent successfully for ${timeUntil} before appointment`
		);
	} catch (error) {
		console.error(error);
		throw error;
	}
});
