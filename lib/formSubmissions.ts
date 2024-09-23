"use client";
import axios from "axios";
import { z } from "zod";
import { PatientOnboardingSchema, SignUpSchema } from "./schema";
import { useRouter } from "next/navigation";
import { getSession, UpdateSession } from "next-auth/react";
import { Session } from "next-auth";
import { toast } from "sonner";

export const useCreateAccount = () => {
  const onCreateAccount = async (data: z.output<typeof SignUpSchema>) => {
    try {
      await axios.post("/api/auth/signup", data);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error)
    }
  };
  return { onCreateAccount };
};
export const usePatientOnboard = (
  session: Session | null,
  update: UpdateSession
) => {
  const router = useRouter();
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
      console.log("updated session", session);
      // router.push("/find-a-doctor");

      console.log(response);
    } catch (error) {
      throw error;
    }
  };
  return { onPatientOnboard };
};
