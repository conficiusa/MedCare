// app/api/paystack/verify/webhook/route.ts
import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/api/utils/email";
import Appointment from "@/models/Appointment";
import moment from "moment";

// Handle the successful payment event
async function handleSuccessfulPayment(event: any) {
  if (event.event === "charge.success") {
    const reference = event.data.reference;
    try {
      // Find the corresponding appointment
      const appointment = await Appointment.findOneAndUpdate(
        { reference },
        {
          paid: true,
        },
        {
          new: true,
        }
      );

      if (!appointment) {
        throw new Error("Appointment not found");
      }
      // Construct the email body
      const emailToPatient = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f7f6;">
          <h2 style="color: #4CAF50;">Appointment Confirmation</h2>
          <p style="font-size: 16px;">Dear ${appointment?.patient?.name},</p>
          <p style="font-size: 16px;">Your appointment with Dr. ${
            appointment?.doctor?.name
          } on ${moment(appointment?.date).format(
        "dddd, MMMM Do YYYY"
      )} has been successfully confirmed. Thank you for using MedCare .</p>
          <p style="font-size: 16px;">If you have any questions, feel free to contact us.</p>
          <p style="font-size: 16px;">Best regards,</p>
          <p style="font-size: 16px;">The Telemedicine Platform Team</p>
        </div>
      `;

      sendEmail(
        "addawebadua@gmail.com",
        "Appointment Confirmation (Test)",
        emailToPatient
      );
      return { message: "Appointment confirmed", status: 200 };
    } catch (error: any) {
      console.error("Error updating appointment status:", error);
      return { message: "Error updating appointment status", status: 500, error };
    }
  }
}

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;
function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");
  return hash === signature;
}
export async function POST(req: Request) {
  const signature = req.headers.get("x-paystack-signature");
  const body = await req.text();
  if (!signature || !verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  console.log(event);
  NextResponse.json({ status: "Webhook received" }, { status: 200 });

  const updateappointment = await handleSuccessfulPayment(event);

  if (updateappointment?.status === 200) {
    return NextResponse.json(
      { message: "Appointment confirmed" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { error: "Error updating appointment status" },
      { status: 500 }
    );
  }
}
