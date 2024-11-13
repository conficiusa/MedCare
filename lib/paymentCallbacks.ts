"use client";
import { toast } from "sonner";
import { VerifyPaystackPayment } from "@/lib/formSubmissions";

// TODO: make sure to get the amount backend for verification in future
export const onSuccess = async (
  res: any,
  amount: number,
) => {
  // verify payment
  const verificationPromise = VerifyPaystackPayment(res.reference, amount);
  toast.promise(verificationPromise, {
    loading: "Confirming your appointment...",

    // Handle payment verification sucess
    success: async (data: any) => {
      //verifying payment was a success
      if (data?.data?.data?.status === "success") {
        return "Your appointment will be confirmed via email";
      }
    },
    error: (error: any) => {
      return "Your appointment confirmation status will be sent via secure email";
    },
    description: (data) => {
      if (data) {
        return "Contact support if you do not receive an email in 30 minutes";
      }
    },
  });
};
