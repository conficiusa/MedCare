"use server";
import {
  onDoctorBoardingSchema1,
  onDoctorBoardingSchema2,
  onDoctorBoardingSchema3,
  onDoctorBoardingSchema4,
  onDoctorBoardingSchema5,
} from "@/lib/schema";
import { z } from "zod";
import { handleDoctorOnboarding } from "@/lib/actions";
import { auth } from "@/auth";
import { ErrorReturn } from "./definitions";
import User from "@/models/User";

//onboarding doctors
// Step 1
export const DoctorOnboardStepOne = (
  data: z.output<typeof onDoctorBoardingSchema1>
) =>
  handleDoctorOnboarding(2, data, onDoctorBoardingSchema1, {
    phone: data.phone,
    dob: data.dob,
    gender: data.gender,
    languages: data.languages?.map((item) => item.value),
    role: "doctor",
    doctorInfo: {
      onboarding_level: 2,
    },
  });

// Step 2
export const DoctorOnboardStepTwo = (
  data: z.output<typeof onDoctorBoardingSchema2>
) =>
  handleDoctorOnboarding(3, data, onDoctorBoardingSchema2, {
    city: data.city,
    region: data.region,
    country: data.country,
    address_1: data.address_1,
    address_2: data.address_2,
    doctorInfo: {
      onboarding_level: 3,
    },
  });

// Step 3
export const DoctorOnboardStepThree = (
  data: z.output<typeof onDoctorBoardingSchema3>
) =>
  handleDoctorOnboarding(4, data, onDoctorBoardingSchema3, {
    doctorInfo: {
      license_number: data?.license_number,
      current_facility: data?.current_facility,
      experience: data?.experience ?? 0,
      specialities: data.specialities?.map((item) => item.value),
      bio: data.bio,
      certifications: data.certifications?.map((item) => item.value),
      onboarding_level: 4,
    },
  });
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
    doctorInfo: {
      bank: data?.bank,
      account_name: data?.bank,
      rate: data?.rate,
      payment_channel: data?.payment_channel,
      media: data?.media,
      account_number: data?.account_number,
      license_number: user?.doctorInfo?.license_number,
      current_facility: user?.doctorInfo?.current_facility,
      experience: user?.doctorInfo?.experience ?? 0,
      specialities: user?.doctorInfo?.specialities,
      bio: user?.doctorInfo?.bio,
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

  const user = await User.findById(authSession?.user?.id).select(
    "doctorInfo.media"
  );

  return handleDoctorOnboarding(6, data, onDoctorBoardingSchema5, {
    image: data?.image,
    doctorInfo: {
      bank: user?.doctorInfo?.bank,
      account_name: user?.doctorInfo?.bank,
      rate: user?.doctorInfo?.rate,
      payment_channel: user?.doctorInfo?.payment_channel,
      media: user?.doctorInfo?.media,
      account_number: user?.doctorInfo?.account_number,
      license_number: user?.doctorInfo?.license_number,
      current_facility: user?.doctorInfo?.current_facility,
      experience: user?.doctorInfo?.experience ?? 0,
      specialities: user?.doctorInfo?.specialities,
      bio: user?.doctorInfo?.bio,
      certifications: user?.doctorInfo?.certifications?.map,
      onboarding_level: 6,
    },
  });
};
