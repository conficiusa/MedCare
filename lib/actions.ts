"use server";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { IAppointmentSchema, SignInSchema } from "@/lib/schema";
import connectToDatabase from "@/lib/mongoose";
import { z } from "zod";
import {
  Appointment as AppointmentType,
  Transaction as TransactionType,
} from "@/lib//definitions";
import Transaction from "@/models/Transactions";
import mongoose, { ClientSession, MongooseError } from "mongoose";
import Appointment from "@/models/Appointment";
import { RoomServiceClient } from "livekit-server-sdk";
import User from "@/models/User";
import moment from "moment";
import { isRedirectError } from "next/dist/client/components/redirect";
import Availability from "@/models/Availability";
import { revalidateTag } from "next/cache";

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

    if (isRedirectError(error)) {
      throw error;
    }
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
  const authsession = await auth();
  if (!authsession) {
    throw new Error("User not authenticated");
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectToDatabase();

    const doctor = await User.findById(
      appointmentData?.doctor?.doctorId
    ).select(["name", "image"]);

    const transaction = new Transaction({ ...transactionData });
    await transaction.save({ session });
    const plainTransaction = transaction.toObject();

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

    const CompleteData = {
      ...appointmentData,
      transactionId: plainTransaction.id,
      doctor: {
        name: doctor?.name,
        image: doctor?.image,
        doctorId: appointmentData?.doctor?.doctorId,
      },
      patient: {
        image: authsession?.user?.image,
        name: authsession?.user?.name,
        patientId: authsession?.user?.id,
      },
      room: {
        name: room.name,
        sid: room.sid,
        maxParticipants: room.maxParticipants,
      },
      paid: true,
    };
    const parsedData = IAppointmentSchema.safeParse(CompleteData);

    if (!parsedData.success) {
      console.error(parsedData.error.flatten().fieldErrors);
      throw new Error("Invalid Data");
    }
    const appointment = new Appointment(parsedData.data);
    await appointment.save({ session });

    // Mark the timeslot as booked
    await markTimeSlotAsBooked(
      appointmentData?.timeSlot?.slotId ?? "",
      authsession.user.id ?? "",
      session
    );
    // If all succeeded, commit the transaction
    await session.commitTransaction();
    session.endSession();

    if (!appointment) {
      throw new Error("Could not create appointment");
    }

    revalidateTag("appointments");
    return {
      appointmentStatus: "success",
      appointment: {
        doctor: {
          doctorId: appointment.doctor.doctorId.toString(),
          name: appointment.doctor.name,
          image: appointment.doctor.image,
        },
        patient: {
          patientId: appointment.patient.patientId.toString(),
          name: appointment.patient.name,
          image: appointment.patient.image,
        },
        transactionId: appointment.transactionId.toString(),
        ...appointment.toObject(),
      },
      message: `Your appointment with Dr. ${doctor?.name} at ${moment(
        appointment?.date
      ).format("dddd, Do MMMM ")} ${
       moment(appointment?.timeSlot?.startTime).format("hh:mm A")
      } has been created successfully. Room: ${room.name}`,
      roomName: room.name,
      title: `Appointment with Dr. ${doctor?.name} created successfully`,
    };
  } catch (error: MongooseError | any) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return {
      error: error._message,
      message: "Oops!! We could not create your appointment",
    };
  }
};

const markTimeSlotAsBooked = async (
  slotId: string,
  patientId: string,
  session: ClientSession
) => {
  try {
    const result = await Availability.findOneAndUpdate(
      { "timeSlots.slotId": slotId }, // Find the availability document containing this slotId
      {
        $set: {
          "timeSlots.$.isBooked": true,
          "timeSlots.$.patientId": patientId, // Set the patientId for the matched slot
        },
      }, // Set isBooked to true for the matched slot
      { new: true, session }
    );

    if (!result) {
      console.log("No timeslot found with the given slot ID.");
      throw new Error("No timeslot found with the given slot ID.");
    }

    return result.timeSlots[0];
  } catch (error) {
    console.error("Error marking timeslot as booked:", error);
    throw new Error("Error marking timeslot as booked");
  }
};
