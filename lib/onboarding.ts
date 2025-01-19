"use server";
import {
  onDoctorBoardingSchema1,
  onDoctorBoardingSchema2,
  onDoctorBoardingSchema3,
  onDoctorBoardingSchema4,
  onDoctorBoardingSchema5,
  onDoctorBoardingSchema6,
} from "@/lib/schema";
import { z } from "zod";
import { handleDoctorOnboarding } from "@/lib/actions";
import { auth } from "@/auth";
import { ErrorReturn } from "./definitions";
import User from "@/models/User";

//onboarding doctors
// Step 1
export const DoctorOnboardStepOne = async (
  data: z.output<typeof onDoctorBoardingSchema1>
) => {
  const authSession = await auth();
  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to create an appointment",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }
  return handleDoctorOnboarding(2, data, onDoctorBoardingSchema1, {
    onboarding_level: 2,
    phone: data.phone,
    gender: data?.gender,
    dob: data.dob,
    languages: data.languages?.map((item) => item.value),
    role: "doctor",
    doctorInfo: {
      onboarding_level: 2,
    },
  });
};
// Step 2
export const DoctorOnboardStepTwo = async (
  data: z.output<typeof onDoctorBoardingSchema2>
) => {
  const authSession = await auth();
  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to create an appointment",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }
  const user = await User.findById(authSession?.user?.id);

  return handleDoctorOnboarding(3, data, onDoctorBoardingSchema2, {
    role: "doctor",
    city: data.city,
    region: data.region,
    country: data.country,
    languages: user?.languages,
    onboarding_level: 3,
    address_1: data.address_1,
    address_2: data.address_2,
    doctorInfo: {
      onboarding_level: 3,
      certifications: user?.doctorInfo?.certifications,
      specialities: user?.doctorInfo?.specialities,
    },
  });
};

// Step 3
export const DoctorOnboardStepThree = async (
  data: z.output<typeof onDoctorBoardingSchema3>
) => {
  const authSession = await auth();
  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to create an appointment",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }
  const user = await User.findById(authSession?.user?.id);
  return handleDoctorOnboarding(4, data, onDoctorBoardingSchema3, {
    languages: user?.languages,
    role: "doctor",
    onboarding_level: 4,
    doctorInfo: {
      medical_school: data?.medical_school,

      license_number: data?.license_number,
      current_facility: data?.current_facility,
      experience: data?.experience ?? 0,
      specialities: data.specialities?.map((item) => item.value),
      bio: data.bio,
      certifications: data.certifications?.map((item) => item.value),
      onboarding_level: 4,
    },
  });
};
export const DoctorOnboardStepFour = async (
  data: z.output<typeof onDoctorBoardingSchema4>
) => {
  const authSession = await auth();

  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to create an appointment",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }

  const user = await User.findById(authSession?.user?.id);
  return handleDoctorOnboarding(5, data, onDoctorBoardingSchema4, {
    languages: user?.languages,
    onboarding_level: 5,
    doctorInfo: {
      bank: data?.bank,
      account_name: data?.account_name,
      rate: data?.rate,
      payment_channel: data?.payment_channel,
      account_number: data?.account_number,
      specialities: user?.doctorInfo?.specialities,
      certifications: user?.doctorInfo?.certifications,
      onboarding_level: 5,
    },
  });
};

export const DoctorOnboardStepFive = async (
  data: z.output<typeof onDoctorBoardingSchema5>
) => {
  const authSession = await auth();

  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to create an appointment",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }

  const user = await User.findById(authSession?.user?.id);
  return handleDoctorOnboarding(6, data, onDoctorBoardingSchema5, {
    image: data?.image,
    languages: user?.languages,
    onboarding_level: 6,
    doctorInfo: {
      specialities: user?.doctorInfo?.specialities,
      certifications: user?.doctorInfo?.certifications,
      onboarding_level: 6,
    },
  });
};


export const DoctorOnboardStepSix = async (
  data: z.output<typeof onDoctorBoardingSchema6>,
  level: number
) => {
  const authSession = await auth();
  const user = await User.findById(authSession?.user?.id);
  return handleDoctorOnboarding(7, data, onDoctorBoardingSchema6, {
    languages: user?.languages,
    onboarding_level: level,
    doctorInfo: {
      specialities: user?.doctorInfo?.specialities,
      certifications: user?.doctorInfo?.certifications,
      onboarding_level: level,
    },
  });
};
