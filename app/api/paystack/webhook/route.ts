// app/api/paystack/verify/webhook/route.ts
import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { handleSuccessfulPayment } from "@/app/api/utils/handlepaymentsucess";
import { sendEmail } from "../../utils/email";
import moment from "moment";
import { ErrorReturn, SuccessReturn } from "@/lib/definitions";
import {
  appointmentConfirmPatient,
  doctorAppointmentEmail,
} from "@/lib/emails";
import { sendEmailAction } from "@/lib/actions";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;
function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");
  return hash === signature;
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
