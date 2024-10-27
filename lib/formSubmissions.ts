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
import { metadata } from "@/app/layout";

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
      const response = await axios.patch("/api/users/onboarding", preparedData);

      await update({ ...session, user: { ...session?.user, role: "patient" } });
    } catch (error) {
      throw error;
    }
  };
  return { onPatientOnboard };
};

export const handlePaystackPayment = async (
  data: z.output<typeof CheckoutSchema>
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
          patient_name: data.fullName,
          patient_email: data.email,
        },
      }),
    });

    const result = await response.json();

    if (result.status) {
      // Redirect to the authorization_url
      // window.location.href = result.result.authorization_url;
      const popup = new PaystackPop();
      popup.resumeTransaction(result?.data?.access_code);
    } else {
      alert("Payment initialization failed");
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment failed, please try again.");
  }
};
