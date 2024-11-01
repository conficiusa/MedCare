"use client";
import { toast } from "sonner";
import { VerifyPaystackPayment } from "@/lib/formSubmissions";
import {
  Appointment,
  MobileMoneyType,
  Transaction,
  VerificationResponse,
} from "@/lib/definitions";
import { FinalizeAppointment } from "@/lib/actions";

export const onSuccess = async (
  res: any,
  amount: number,
  doctorId: string,
  time: string,
  date: string
) => {
  // Verify payment
  const verificationPromise = VerifyPaystackPayment(res.reference, amount);
  toast.promise(verificationPromise, {
    loading: "Verifying payment...",

    // Handle payment verification sucess
    success: async (data: VerificationResponse) => {
      //verifying payment was a success
      if (data?.data?.status === "success") {
        //updating db wth transaction and appointment data as a transaction

        return "Payment verified successfully";
      } else {
        throw new Error("Payment verification failed");
      }
    },
    error: (error) => {
      return "payment could not be verified";
    },
  });
  const data= await verificationPromise;

  if (data?.data?.status === "success") {
    //getting transaction and appointment data
    const transactionData: Omit<
      Transaction,
      "id" | "createdAt" | "updatedAt" | "appointmentId"
    > = {
      patientId: data?.data?.metadata?.patientId,
      amount,
      channel: data?.data?.channel,
      currency: data?.data?.currency,
      purpose: "Online Consultation",
      status: "completed",
      doctorId,
      IpAddress: data?.data?.ip_address,
      paidAt: data?.data?.paid_at,
      receiptNumber: data?.data?.receipt_number,
    };

    if (transactionData?.channel === "mobile_money") {
      transactionData.mobileMoneyType = data?.data?.authorization
        ?.bank as MobileMoneyType;
    }
    const appointmentData: Partial<Appointment> = {
      doctorId,
      patientId: data?.data?.metadata?.patientId,
      date,
      mode: "online",
      paid: true,
      status: "pending",
      time,
      online_medium: "video",
    };

    toast.promise(FinalizeAppointment(transactionData, appointmentData), {
      loading: "Finalizing appointment...",
      success: "Appointment finalized successfully",
      error: "Appointment could not be finalized",
    })
  }
};
