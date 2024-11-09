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
  start: string,
  end: string,
  date: string,
  slotId: string,
  router: any
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
    error: (error: any) => {
      return error.message;
    },
  });
  const data = await verificationPromise;

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
      doctor: {
        doctorId: doctorId,
      },
      date,
      mode: "online",
      paid: true,
      status: "pending",
      timeSlot: {
        startTime: start,
        endTime: end,
        slotId,
      },
      online_medium: "video",
    };

    const finalizePromise = FinalizeAppointment(
      transactionData,
      appointmentData
    );
    toast.promise(finalizePromise, {
      loading: "Finalizing appointment...",
      success: (data) => {
        if (data.appointmentStatus === "success") {
          return data.title;
        }
      },
      error: (error: any) => {
        return error.message;
      },
      description(data) {
        if (data.appointmentStatus === "success") {
          return data.message;
        }
      },
      duration: 8000,
    });

    const finalData = await finalizePromise;
    if (finalData.appointmentStatus === "success") {
      router.push("/dashboard/appointments");
    }
  }
};
