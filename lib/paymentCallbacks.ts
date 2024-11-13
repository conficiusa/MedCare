"use client";
import { toast } from "sonner";
import { VerifyPaystackPayment } from "@/lib/formSubmissions";
import { Appointment, VerificationResponse } from "@/lib/definitions";
import { CreateAppointment } from "@/lib/actions";

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
  // create appointment
  const appointmentData: Partial<Appointment> = {
    doctor: {
      doctorId: doctorId,
    },
    date,
    reference: res?.reference,
    mode: "online",
    paid: false,
    status: "pending",
    timeSlot: {
      startTime: start,
      endTime: end,
      slotId,
    },
    online_medium: "video",
  };

  const finalizePromise = CreateAppointment(appointmentData);
  toast.promise(finalizePromise, {
    loading: "Creating appointment...",
    success: (data) => {
      if (data.appointmentStatus === "success") {
        return data.details;
      }
    },
    error: (error: any) => {
      return error.message;
    },
    duration: 8000,
  });

  const finalizeData = await finalizePromise;

  // verify payment
  if (finalizeData?.appointmentStatus === "success") {
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
  }
};
