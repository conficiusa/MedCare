"use server";
import { Transaction as TransactionType } from "@/lib/definitions";
import connectToDatabase from "@/lib/mongoose";
import Appointment from "@/models/Appointment";
import Transaction from "@/models/Transactions";

// Handle the successful payment event
export async function handleSuccessfulPayment(
  appointmentId: string,
  data: any
) {
  const transactionData: Omit<TransactionType, "id"> = {
    appointmentId,
    amount: data.amount *0.01,
    reference: data.reference,
    currency: data.currency,
    channel: data.channel,
    doctorId: data?.metadata?.doctorId,
    patientId: data?.metadata?.patientId,
    status: "completed",
    IpAddress: data?.ip_address,
    purpose: "Online Consultation",
    mobileMoneyType: data?.authorization?.bank,
    paidAt: data?.paidAt,
    receiptNumber: data?.receiptNumber,
  };

  try {
    await connectToDatabase();
    // Find the corresponding appointment
    const transaction = new Transaction(transactionData);
    await transaction.save();
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paid: true,
        reference: data.reference,
        transactionId: transaction._id,
      },
      {
        runValidators: true,
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
