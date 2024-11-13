// app/api/paystack/verify/webhook/route.ts
"use server";
import { sendEmail } from "@/app/api/utils/email";
import connectToDatabase from "@/lib/mongoose";
import Appointment from "@/models/Appointment";
import moment from "moment";

// Handle the successful payment event
export async function handleSuccessfulPayment(reference: string) {
  try {
    await connectToDatabase();
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
    return {
      message: "Error updating appointment status",
      status: 500,
      error,
    };
  }
}
