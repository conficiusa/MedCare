"use server";
import { ReturnType, Transaction as TransactionType } from "@/lib/definitions";
import connectToDatabase from "@/lib/mongoose";
import Appointment from "@/models/Appointment";
import Transaction from "@/models/Transactions";
import { RoomServiceClient } from "livekit-server-sdk";
import { MongooseError } from "mongoose";
import { validate } from "uuid";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
const roomService = new RoomServiceClient(
  wsUrl as string,
  apiKey as string,
  apiSecret as string
);
// Handle the successful payment event
export async function handleSuccessfulPayment(
  appointmentId: string,
  data: any
): Promise<ReturnType> {
  // missing keys error handling
  if (!apiKey || !apiSecret || !wsUrl) {
    return {
      error: "Server misconfigured",
      message: "Missing keys Configuration",
      type: "Server Error",
      status: "fail",
      statusCode: 500,
    };
  }

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

    // Create a room for the appointment

    // room options
    const opts = {
      name: Date.now().toString(),
      emptyTimeout: 10 * 60, // 10 minutes
      maxParticipants: 2,
    };

    // Create the room
    const room = await roomService.createRoom(opts);

    //handle error if room is not created
    if (!room) {
      return {
        error: "Room not created",
        message: "We could not create your room",
        status: "fail",
        statusCode: 500,
        type: "Server Error",
      };
    }

    // Update the appointment status

    //log room for debuging
    console.log(room);
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paid: true,
        reference: data.reference,
        transactionId: transaction._id,
        room: {
          name: room.name,
          sid: room.sid,
          maxParticipants: room?.maxParticipants,
        },
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
