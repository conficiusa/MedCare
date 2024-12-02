"use server";
"use server";
import {
  PatientOnboardingSchema1,
  PatientOnboardingSchema2,
  PatientOnboardingSchema3,
  patientOnBoardingSchema4,
} from "@/lib/schema";
import { z } from "zod";
import { handlePatientOnboarding } from "@/lib/actions";
import { auth } from "@/auth";
import { ErrorReturn } from "./definitions";
import User from "@/models/User";

//onboarding patient actions
// Step 1
export const PatientOnboardStepOne = async (
  data: z.output<typeof PatientOnboardingSchema1>
) => {
  const authSession = await auth();

  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to onboard as a patient",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }
  const user = await User.findById(authSession?.user?.id);
  console.log(data);
  return handlePatientOnboarding(2, data, PatientOnboardingSchema1, {
    address_1: user?.address_1,
    address_2: user?.address_2,
    city: user?.city,
    region: user?.region,
    country: user?.country,
    image: user?.image,
    onboarding_level: 2,
    phone: data.phone,
    dob: data.dob,
    gender: data?.gender,
    languages: data.languages?.map((item) => item.value),
    patientInfo: {
      conditions: user?.patientInfo?.conditions,
      medicalHistory: user?.patientInfo?.medicalHistory,
    },
    role: "patient",
  });
};

// Step 2
export const PatientOnboardStepTwo = async (
  data: z.output<typeof PatientOnboardingSchema2>
) => {
  const authSession = await auth();
  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to onboard as a patient",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }
  const user = await User.findById(authSession?.user?.id);

  return handlePatientOnboarding(3, data, PatientOnboardingSchema2, {
    dob: user?.dob,
    role: "patient",
    city: data.city,
    region: data.region,
    country: data.country,
    image: user?.image,
    phone: user?.phone,
    languages: user?.languages,
    onboarding_level: 3,
    address_1: data.address_1,
    address_2: data.address_2,
    patientInfo: {
      conditions: user?.patientInfo?.conditions,
      medicalHistory: user?.patientInfo?.medicalHistory,
    },
  });
};

// Step 3
export const PatientOnboardStepThree = async (
  data: z.output<typeof PatientOnboardingSchema3>
) => {
  const authSession = await auth();
  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to onboard as a patient",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }
  const user = await User.findById(authSession?.user?.id);
  return handlePatientOnboarding(4, data, PatientOnboardingSchema3, {
    address_1: user?.address_1,
    address_2: user?.address_2,
    city: user?.city,
    region: user?.region,
    country: user?.country,
    image: user?.image,
    phone: user?.phone,
    dob: user?.dob,
    languages: user?.languages,
    role: "patient",
    onboarding_level: 4,
    patientInfo: {
      conditions: data.conditions?.map((item) => item.value),
      medicalHistory: data.medicalHistory,
    },
  });
};

export const PatientOnboardStepFour = async (
  data: z.output<typeof patientOnBoardingSchema4>
) => {
  const authSession = await auth();

  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to onboard as a patient",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }

  const user = await User.findById(authSession?.user?.id);
  return handlePatientOnboarding(5, data, patientOnBoardingSchema4, {
    image: user?.image,
    address_1: user?.address_1,
    address_2: user?.address_2,
    city: user?.city,
    region: user?.region,
    country: user?.country,
    phone: user?.phone,
    dob: user?.dob,
    languages: user?.languages,
    role: "patient",
    onboarding_level: 7,
    patientInfo: {
      conditions: user?.patientInfo?.conditions,
      medicalHistory: user?.patientInfo?.medicalHistory,
    },
  });
};
