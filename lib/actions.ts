"use server";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { SignInSchema } from "@/lib/schema";
import connectToDatabase from "@/lib/mongoose";
import { z } from "zod";
import {
  Appointment as AppointmentType,
  Transaction as TransactionType,
} from "@/lib//definitions";
import Transaction from "@/models/Checkout";
import mongoose from "mongoose";
import Appointment from "@/models/Appointment";
import { RoomServiceClient } from "livekit-server-sdk";
import User from "@/models/User";
import moment from "moment";

export type State = {
  message: string | undefined;
  errors?: {
    email?: string[];
    password?: string[];
  };
  // fields?: Record<string, string>;
};

export async function emailAuth(
  email: z.output<typeof SignInSchema>,
  callbackUrl: string | null
) {
  try {
    await connectToDatabase().catch((error: any) => {
      return {
        message: "Unable to Connect to server",
        type: "Server Error",
      };
    });
    const parsed = SignInSchema.safeParse(email);
    if (!parsed.success) {
      return {
        errors: parsed.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Sign In.",
        type: "ValidationError",
      };
    }
    await signIn("nodemailer", {
      ...parsed.data,
      callbackUrl,
    });
  } catch (error: any) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid Credentials",
            type: "Credentials Error",
          };
        case "CallbackRouteError":
          return {
            message:
              "This account was likely created with a different provider.",
            type: "Callback Error",
          };
        default:
          return {
            message: "An unexpected error occurred.",
            type: "Unexpected Error",
          };
      }
    }
    throw error;
  }
}

export const googleSignIn = async (redirect: string | null) => {
  try {
    await signIn("google", {
      callbackUrl: redirect ?? "/find-a-doctor",
      redirectTo: redirect ?? "/find-a-doctor",
    });
  } catch (error: any) {
    console.error(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "OAuthSignInError":
          return {
            message: "Could not sign in with Google",
          };
        case "CallbackRouteError":
          return {
            message: "This email is linked to a another account",
          };
        default:
          return {
            message: "An unexpected error occurred.",
          };
      }
    }
    throw error;
  }
};

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
const roomService = new RoomServiceClient(
  wsUrl as string,
  apiKey as string,
  apiSecret as string
);
export const FinalizeAppointment = async (
  transactionData: Omit<
    TransactionType,
    "id" | "createdAt" | "updatedAt" | "appointmentId"
  >,
  appointmentData: Partial<AppointmentType>
) => {
  try {
    const authsession = await auth();
    if (!authsession) {
      throw new Error("User not authenticated");
    }
    await connectToDatabase();
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new Transaction({ ...transactionData });
    await transaction.save({ session });

    if (!apiKey || !apiSecret || !wsUrl) {
      return {
        message: "Server misconfigured",
        type: "Server Error",
        status: 500,
      };
    }
    const opts = {
      name: Date.now().toString(),
      emptyTimeout: 10 * 60, // 10 minutes
      maxParticipants: 2,
    };
    const room = await roomService.createRoom(opts);
    if (!room) {
      throw new Error("Could not create room");
    }
    const appointment = new Appointment({
      ...appointmentData,
      transactionId: transaction._id,
      room: {
        name: room.name,
        sid: room.sid,
        maxParticipants: room.maxParticipants,
      },
      paid: true,
    });
    await appointment.save({ session });
    const doctor = await User.findById(appointment.doctorId).select("name");

    // If all succeeded, commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      appointmentStatus: "success",
      appointment: {
        doctorId: appointment.doctorId.toString(),
        patientId: appointment.patientId.toString(),
        transactionId: appointment.transactionId.toString(),
        ...appointment.toObject(),
      },
      message: `Your appointment with Dr. ${doctor?.name} at ${moment(
        appointment?.date
      ).format("dddd, Do MMMM ")} ${
        appointment?.time?.split("-")[0]
      } has been created successfully. Room: ${room.name}`,
      roomName: room.name,
    };
  } catch (error) {
    return { error, message: "Oops!! We could not create your appointment" };
  }
};
