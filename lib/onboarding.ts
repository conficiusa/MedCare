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
  const user = await User.findById(authSession?.user?.id);
  return handleDoctorOnboarding(2, data, onDoctorBoardingSchema1, {
    address_1: user?.address_1,
    address_2: user?.address_2,
    city: user?.city,
    region: user?.region,
    country: user?.country,
    image: user?.image,
    onboarding_level: 2,
    phone: data.phone,
    gender: data?.gender,
    dob: data.dob,
    languages: data.languages?.map((item) => item.value),
    role: "doctor",
    doctorInfo: {
      account_name: user?.doctorInfo?.account_name,
      account_number: user?.doctorInfo?.account_number,
      bank: user?.doctorInfo?.bank,
      bio: user?.doctorInfo?.bio,
      certifications: user?.doctorInfo?.certifications,
      current_facility: user?.doctorInfo?.current_facility,
      experience: user?.doctorInfo?.experience,
      license_number: user?.doctorInfo?.license_number,
      medical_school: user?.doctorInfo?.medical_school,
      payment_channel: user?.doctorInfo?.payment_channel,
      rate: user?.doctorInfo?.rate,
      specialities: user?.doctorInfo?.specialities,
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
    dob: user?.dob,
    role: "doctor",
    city: data.city,
    region: data.region,
    country: data.country,
    image: user?.image,
    phone: user?.phone,
    languages: user?.languages,
    onboarding_level: 3,
    address_1: data.address_1,
    address_2: data.address_2,
    doctorInfo: {
      onboarding_level: 3,
      account_name: user?.doctorInfo?.account_name,
      account_number: user?.doctorInfo?.account_number,
      bank: user?.doctorInfo?.bank,
      bio: user?.doctorInfo?.bio,
      certifications: user?.doctorInfo?.certifications,
      current_facility: user?.doctorInfo?.current_facility,
      experience: user?.doctorInfo?.experience,
      license_number: user?.doctorInfo?.license_number,
      medical_school: user?.doctorInfo?.medical_school,
      payment_channel: user?.doctorInfo?.payment_channel,
      rate: user?.doctorInfo?.rate,
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
    address_1: user?.address_1,
    address_2: user?.address_2,
    city: user?.city,
    region: user?.region,
    country: user?.country,
    image: user?.image,
    phone: user?.phone,
    dob: user?.dob,
    languages: user?.languages,
    role: "doctor",
    onboarding_level: 4,
    doctorInfo: {
      license_number: data?.license_number,
      current_facility: data?.current_facility,
      experience: data?.experience ?? 0,
      specialities: data.specialities?.map((item) => item.value),
      bio: data.bio,
      certifications: data.certifications?.map((item) => item.value),
      onboarding_level: 4,
      account_name: user?.doctorInfo?.account_name,
      account_number: user?.doctorInfo?.account_number,
      bank: user?.doctorInfo?.bank,
      medical_school: data?.medical_school,
      payment_channel: user?.doctorInfo?.payment_channel,
      rate: user?.doctorInfo?.rate,
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
    address_1: user?.address_1,
    address_2: user?.address_2,
    city: user?.city,
    region: user?.region,
    country: user?.country,
    image: user?.image,
    phone: user?.phone,
    dob: user?.dob,
    languages: user?.languages,
    role: "doctor",
    onboarding_level: 5,
    doctorInfo: {
      bank: data?.bank,
      account_name: data?.account_name,
      rate: data?.rate,
      payment_channel: data?.payment_channel,
      medical_school: user?.doctorInfo?.medical_school,
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
  data: z.output<typeof onDoctorBoardingSchema5>,
  onboarding_level: number
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
  return handleDoctorOnboarding(onboarding_level, data, onDoctorBoardingSchema5, {
    image: data?.image,
    address_1: user?.address_1,
    address_2: user?.address_2,
    city: user?.city,
    region: user?.region,
    country: user?.country,
    phone: user?.phone,
    dob: user?.dob,
    languages: user?.languages,
    role: "doctor",
    onboarding_level,
    doctorInfo: {
      bank: user?.doctorInfo?.bank,
      account_name: user?.doctorInfo?.account_name,
      rate: user?.doctorInfo?.rate,
      payment_channel: user?.doctorInfo?.payment_channel,
      medical_school: user?.doctorInfo?.medical_school,
      account_number: user?.doctorInfo?.account_number,
      license_number: user?.doctorInfo?.license_number,
      current_facility: user?.doctorInfo?.current_facility,
      experience: user?.doctorInfo?.experience ?? 0,
      specialities: user?.doctorInfo?.specialities,
      bio: user?.doctorInfo?.bio,
      certifications: user?.doctorInfo?.certifications,
      onboarding_level,
    },
  });
};
export const DoctorOnboardStepSix = async (
  data: z.output<typeof onDoctorBoardingSchema6>,
  level: number
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
  return handleDoctorOnboarding(7, data, onDoctorBoardingSchema6, {
    image: user?.image,
    address_1: user?.address_1,
    address_2: user?.address_2,
    city: user?.city,
    region: user?.region,
    gender: user?.gender,
    country: user?.country,
    phone: user?.phone,
    dob: user?.dob,
    languages: user?.languages,
    role: "doctor",
    onboarding_level: level,
    doctorInfo: {
      verification: data?.verification,
      bank: user?.doctorInfo?.bank,
      account_name: user?.doctorInfo?.account_name,
      rate: user?.doctorInfo?.rate,
      payment_channel: user?.doctorInfo?.payment_channel,
      medical_school: user?.doctorInfo?.medical_school,
      account_number: user?.doctorInfo?.account_number,
      license_number: user?.doctorInfo?.license_number,
      current_facility: user?.doctorInfo?.current_facility,
      experience: user?.doctorInfo?.experience ?? 0,
      specialities: user?.doctorInfo?.specialities,
      bio: user?.doctorInfo?.bio,
      certifications: user?.doctorInfo?.certifications,
      onboarding_level: level,
    },
  });
};
