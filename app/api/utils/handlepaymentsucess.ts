"use server";
import { ReturnType, Transaction as TransactionType } from "@/lib/definitions";
import connectToDatabase from "@/lib/mongoose";
import Appointment from "@/models/Appointment";
import Transaction from "@/models/Transactions";
import { RoomServiceClient } from "livekit-server-sdk";
import { MongooseError } from "mongoose";

// Handle the successful payment event
export async function handleSuccessfulPayment(
  appointmentId: string,
  data: any
): Promise<ReturnType> {
  try {
    await connectToDatabase();
    // Construct the transaction data
    const transactionData: Omit<TransactionType, "id"> = {
      appointmentId,
      amount: data.amount * 0.01,
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
      cardType: data?.authorization?.card_type,
    };

    // Save the transaction
    const transaction = new Transaction(transactionData);
    await transaction.save();

    //handle error if transaction is not saved
    if (!transaction) {
      return {
        error: "Transaction not saved",
        message: "We could not create your transaction",
        status: "fail",
        statusCode: 500,
        type: "Server Error",
      };
    }
    // Update the appointment status
    //log room for debuging
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

    //handle error if appointment is not updated

    if (!appointment) {
      return {
        error: "Appointment not updated",
        message:
          "We could not update your appointment, please contact support if you've been charged",
        status: "fail",
        statusCode: 500,
        type: "Server Error",
      };
    }

    // Return the updated appointment
    return {
      message: "Appointment updated successfully",
      status: "success",
      data: appointment,
      statusCode: 200,
    };
  } catch (error: any) {
    console.error("Error updating appointment status:", error);

    // Handle the error
    if (error instanceof MongooseError) {
      console.error("Mongoose Error:", error);
      if (error?.name === "'ValidationError") {
        return {
          error: "Validation Error",
          message: error?.message,
          status: "fail",
          statusCode: 400,
          type: "Validation Error",
        };
      }
      return {
        error: "A database error occurred",
        message: error?.message,
        status: "fail",
        statusCode: 500,
        type: "Database Error",
      };
    }
    console.error("Error:", error);
    return {
      error: "A server error occurred",
      message: error?.message,
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    };
  }
}
