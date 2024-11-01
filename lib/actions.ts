"use server";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { SignInSchema } from "@/lib/schema";
import connectToDatabase from "@/lib/mongoose";
import { z } from "zod";
import {
  IAppointment,
  Transaction as TransactionType,
} from "@/lib//definitions";
import Transaction from "@/models/Checkout";
import { VerifyPaystackPayment } from "./utils";
import mongoose from "mongoose";
import Appointment from "@/models/Appointment";

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
    console.log(error.type);
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

export const FinalizeAppointment = async (
  transactionData: Omit<
    TransactionType,
    "id" | "createdAt" | "updatedAt" | "appointmentId"
  >,
  appointmentData: IAppointment
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

    const appointment = new Appointment({
      ...appointmentData,
      transactionId: transaction._id,
      paid: true,
    });
    await appointment.save({ session });

    // If all succeeded, commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { appointment, message: "appointment created succesfully" };
  } catch (error) {
    throw error;
  }
};

// export const CompleteTransaction = async (
//   reference: string,
//   amount: number
// ) => {
//   try {
//     const data = await VerifyPaystackPayment(reference, amount);
//     console.log(data);
//     await createTransactions(data);
//     return data;
//   } catch (error) {
//     console.error("Payment Verification error:", error);
//     throw error;
//   }
// };
