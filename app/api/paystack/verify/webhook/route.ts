import { createHmac } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/app/api/utils/email";
import Appointment from "@/models/Appointment";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string; // Store in .env
// Function to verify Paystack's signature
function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");
  return hash === signature;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const signature = req.headers["x-paystack-signature"] as string;
    const body = JSON.stringify(req.body);

    if (!verifySignature(body, signature)) {
      return res.status(400).send("Invalid signature");
    }

    const event = req.body;

    // Acknowledge the webhook event early
    res.status(200).send("Webhook received");

    // Now handle the long-running tasks asynchronously
    if (event.event === "charge.success") {
      await handleSuccessfulPayment(event);
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}

// Handle the successful payment event
async function handleSuccessfulPayment(event: any) {
  try {
    const reference = event.data.reference;
    const doctorId = event.data.metadata?.doctorId; // You can store custom metadata on Paystack payments
    const patientId = event.data.metadata?.patientId;

    // Find the corresponding appointment
    const appointment = await Appointment.findOne({ reference });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Update the appointment status to "confirmed"
    appointment.paid = true;
    appointment.status = "confirmed";
    await appointment.save();

    const emailBody = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f7f6;">
    <h2 style="color: #4CAF50;">Appointment Confirmation</h2>
    <p style="font-size: 16px;">Dear ${appointment?.patient?.name},</p>
    <p style="font-size: 16px;">Your appointment has been successfully confirmed. Thank you for using our telemedicine platform.</p>
    <p style="font-size: 16px;">If you have any questions, feel free to contact us.</p>
    <p style="font-size: 16px;">Best regards,</p>
    <p style="font-size: 16px;">The Telemedicine Platform Team</p>
  </div>
`;

    // Optionally, send a confirmation email
    await sendEmail(
      patientId,
      "Your appointment has been confirmed.",
      emailBody
    );

    // Notify the doctor or perform other tasks if needed
    // await notifyDoctor(doctorId, 'A new appointment has been confirmed.');
  } catch (error) {
    console.error("Error handling successful payment:", error);
    // Optionally handle errors or retry logic if necessary
  }
}
