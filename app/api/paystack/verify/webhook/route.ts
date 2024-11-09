// app/api/paystack/verify/webhook/route.ts
import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/api/utils/email";
import Appointment from "@/models/Appointment";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;

// Function to verify Paystack's signature
function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");
  return hash === signature;
}

// Handle the webhook request
export async function POST(req: Request) {
  const signature = req.headers.get("x-paystack-signature");
  const body = await req.text(); // Get raw body for verification

  if (!signature || !verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Parse the body as JSON after verifying signature
  const event = JSON.parse(body);

  // Acknowledge receipt of the webhook event early
  const response = NextResponse.json(
    { status: "Webhook received" },
    { status: 200 }
  );

  // Handle the long-running task asynchronously
  handleSuccessfulPayment(event).catch((error) => {
    console.error("Error handling successful payment:", error);
  });

  return response;
}

// Handle the successful payment event
async function handleSuccessfulPayment(event: any) {
  if (event.event === "charge.success") {
    const reference = event.data.reference;
    const doctorId = event.data.metadata?.doctorId; // Custom metadata stored on Paystack payments
    const patientId = event.data.metadata?.patientId;

    try {
      // Find the corresponding appointment
      const appointment = await Appointment.findOne({ reference });

      if (!appointment) {
        throw new Error("Appointment not found");
      }

      // Update the appointment status to "confirmed"
      appointment.paid = true;
      appointment.status = "confirmed";
      await appointment.save();

      // Construct the email body
      const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f7f6;">
          <h2 style="color: #4CAF50;">Appointment Confirmation</h2>
          <p style="font-size: 16px;">Dear ${appointment.patient?.name},</p>
          <p style="font-size: 16px;">Your appointment has been successfully confirmed. Thank you for using our telemedicine platform.</p>
          <p style="font-size: 16px;">If you have any questions, feel free to contact us.</p>
          <p style="font-size: 16px;">Best regards,</p>
          <p style="font-size: 16px;">The Telemedicine Platform Team</p>
        </div>
      `;

      // Send a confirmation email to the patient
      await sendEmail(
        patientId,
        "Your appointment has been confirmed.",
        emailBody
      );

      // Notify the doctor or perform other tasks if needed
      // await notifyDoctor(doctorId, 'A new appointment has been confirmed.');
    } catch (error) {
      console.error("Error updating appointment status:", error);
      // Optionally handle retries or additional error handling here
    }
  }
}
