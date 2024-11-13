"use client";
import axios from "axios";
import { z } from "zod";
import {
  CheckoutSchema,
  PatientOnboardingSchema,
  SignUpSchema,
} from "@/lib/schema";
import { UpdateSession } from "next-auth/react";
import { Session } from "next-auth";
import { toast } from "sonner";
import PaystackPop from "@paystack/inline-js";
import { onSuccess } from "@/lib/paymentCallbacks";
import { findTimeSlotBySlotId } from "./queries";

export const useCreateAccount = () => {
  const onCreateAccount = async (data: z.output<typeof SignUpSchema>) => {
    try {
      await axios.post("/api/auth/signup", data);
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  };
  return { onCreateAccount };
};
export const usePatientOnboard = (
  session: Session | null,
  update: UpdateSession
) => {
  const onPatientOnboard = async (
    data: z.output<typeof PatientOnboardingSchema>
  ) => {
    try {
      const preparedData = {
        ...data,
        languages: data?.languages?.map((lang) => lang.value),
        conditions: data?.conditions?.map((condition) => condition.value),
      };
      await axios.patch("/api/users/onboarding", preparedData);

      await update({ ...session, user: { ...session?.user, role: "patient" } });
    } catch (error) {
      throw error;
    }
  };
  return { onPatientOnboard };
};

export const VerifyPaystackPayment = async (
  reference: string,
  amount: number
) => {
  try {
    const response = await fetch(
      `/api/paystack/verify/${reference}?rate=${amount}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Payment Veriication error:", error);
    alert("Payment verification failed, please try again.");
  }
};

export const handlePaystackPayment = async (
  data: z.output<typeof CheckoutSchema>,
  session: Session | null
) => {
  try {
    const response = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        amount: data.amount,
        channels: [data.channel],
        metadata: {
          patientId: session?.user?.id,
          patient_name: data.fullName,
          patient_email: data.email,
          appointment: data.appointment,
        },
      }),
    });

    const result = await response.json();

    if (result.status) {
      const popup = new PaystackPop(); // Initialize Paystack inline

      popup.resumeTransaction(result?.data?.access_code, {
        // Handle payment success
        onSuccess: (res: any) => onSuccess(res, data.amount),
      });
    } else {
      // Handle payment initialization error
      toast.error("Payment initialization failed", {
        description: result.message,
      });
      console.error("Payment initialization failed", result);
    }
  } catch (error: any) {
    console.error("Payment error:", error);
    toast.error(error.message);
  }
};
