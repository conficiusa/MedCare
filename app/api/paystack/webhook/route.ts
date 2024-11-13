// app/api/paystack/verify/webhook/route.ts
import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { handleSuccessfulPayment } from "@/app/api/utils/handlepaymentsucess";
import { sendEmail } from "../../utils/email";
import moment from "moment";

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

  NextResponse?.json({ message: "Webhook received" }, { status: 200 });
  const event = JSON.parse(body);
  if (event.event === "charge.success") {
    const data = event.data;
    console.log("event", event);

    const updateappointment = await handleSuccessfulPayment(
      event?.data?.metadata?.appointment,
      data
    );
    if (updateappointment?.status === 200) {
      const appointment = updateappointment?.appointment;
      const emailToPatient = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f7f6;">
          <h2 style="color: #4CAF50;">Appointment Confirmation</h2>
          <p style="font-size: 16px;">Dear ${appointment?.patient?.name},</p>
          <p style="font-size: 16px;">Your appointment with Dr. ${
            appointment?.doctor?.name
          } on ${moment(appointment?.date).format(
        "dddd, MMMM Do YYYY hh:mm A"
      )} has been successfully confirmed. Thank you for using MedCare .</p>
          <p style="font-size: 16px;">If you have any questions, feel free to contact us.</p>
          <p style="font-size: 16px;">Best regards,</p>
          <p style="font-size: 16px;">The Telemedicine Platform Team</p>
        </div>
      `;
      await sendEmail(
        "addawebadua@gmail.com",
        "Appointment Confirmation",
        emailToPatient
      );
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
  } else {
    const emailToPatient = `
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
      "addawebadua@gmail.com",
      "Could not confirm appointment",
      emailToPatient
    );

    return NextResponse.json("appointment not confirmed");
  }
}
