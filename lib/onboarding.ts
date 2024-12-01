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
      media: user?.doctorInfo?.media,
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
      media: user?.doctorInfo?.media,
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
      media: user?.doctorInfo?.media,
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

  const user = await User.findById(authSession?.user?.id);
  return handleDoctorOnboarding(6, data, onDoctorBoardingSchema5, {
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
    onboarding_level: 6,
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
      certifications: user?.doctorInfo?.certifications,
      onboarding_level: 6,
    },
  });
};
export const DoctorOnboardStepSix = async (
  data: z.output<typeof onDoctorBoardingSchema6>
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
    country: user?.country,
    phone: user?.phone,
    dob: user?.dob,
    languages: user?.languages,
    role: "doctor",
    onboarding_level: 7,
    doctorInfo: {
      verification: data?.verification,
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
      certifications: user?.doctorInfo?.certifications,
      onboarding_level: 7,
    },
  });
};
