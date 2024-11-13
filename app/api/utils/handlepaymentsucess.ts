"use server";
import connectToDatabase from "@/lib/mongoose";
import Appointment from "@/models/Appointment";

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
    return { message: "Appointment confirmed", status: 200, appointment };
  } catch (error: any) {
    console.error("Error updating appointment status:", error);
    return {
      message: "Error updating appointment status",
      status: 500,
      error,
    };
  }
}
