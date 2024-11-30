import { Document, ObjectId, Types } from "mongoose";
import React from "react";

//////////Mongoose definitions///////////
// User interface, reflecting initial sign-up and onboarding
export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role?: "doctor" | "patient" | null;
  languages?: string[];
  country?: string;
  region?: string;
  city?: string;
  dob?: Date;
  phone?: string;
  gender?: string;
  address_1?: string;
  address_2?: string;
  onboarding_level: number;
  doctorInfo?: IDoctorInfo; // Optional for patients
}

export interface ITransaction extends Document {
  appointmentId?: ObjectId;
  reference: string;
  purpose: string;
  patientId: ObjectId;
  doctorId: ObjectId;
  amount: number;
  currency: string;
  receiptNumber: string;
  IpAddress: string;
  paidAt: string;
  status: "pending" | "completed" | "failed";
  channel: PaymentMethod;
  mobileMoneyType?: MobileMoneyType;
}
export interface IDoctorInfo extends Document {
  current_facility?: string;
  specialities?: string[];
  experience: number;
  rate: number;
  certifications?: string[];
  rating?: number;
  bio: string;
  license_number: string;
  account_name: string;
  account_number: string;
  bank: string;
  payment_channel: string;
  onboarding_level: number;
  media: string[];
}
export interface IAppointment extends Document {
  doctor: {
    doctorId: ObjectId;
    name: string;
    image: string;
  };
  patient: {
    patientId: ObjectId;
    name?: string;
    image?: string;
  };
  transactionId: ObjectId;
  reference: string;
  date: Date;
  timeSlot: {
    startTime: string;
    endTime: string;
    slotId: string;
  };
  status: "pending" | "completed" | "cancelled";
  paid: boolean;
  mode: "online" | "in-person";
  online_medium?: "video" | "audio" | "chat";
  room: {
    name: string;
    sid: string;
    maxParticipants: number;
  };
}

// Patient profile interface, extending the user
export interface IPatientProfile extends IUser, Document {
  conditions?: string[];
  medicalHistory?: string;
  userId?: ObjectId | string;
}

// Define the structure of each time slot in the `timeSlots` array
export interface ITimeSlot {
  slotId: string; // Unique ID for each time slot
  startTime: string; // Start time in "HH:mm" format
  endTime: string; // End time in "HH:mm" format
  isBooked: boolean; // Booking status
  patientId?: Types.ObjectId | null; // Patient who booked the slot, if any
  cancellationReason?: string; // Reason if the slot was canceled
  rescheduledTo?: {
    date: Date;
    startTime: string;
    endTime: string;
  } | null; // New slot if this one was rescheduled
  createdAt: Date;
  updatedAt: Date;
}

//onboarding steps
export interface IOnboardingState extends Document {
  userId: Types.ObjectId; // Reference to the user
  currentStep: number; // Current step in the onboarding process
  completedSteps: string[]; // List of completed steps
  data: Record<string, any>; // Additional data for each step
  role: "doctor" | "patient"; // Role of the user being onboarded
  createdAt: Date; // Timestamp when onboarding started
  updatedAt: Date; // Timestamp when onboarding was last updated
}

// Define the main availability schema interface
export interface IAvailability extends Document {
  doctorId: Types.ObjectId;
  date: Date;
  timeSlots: ITimeSlot[];
  expiresAt: Date; // TTL field to automatically delete past slots
}

////////////Application definitions///////////
////////////Application definitions///////////
////////////Application definitions///////////
////////////Application definitions///////////
////////////Application definitions///////////

export interface DoctorInfo {
  current_facility?: string;
  specialities?: string[];
  experience: number;
  rate: number;
  certifications?: string[];
  rating?: number;
  bio: string;
  license_number: string;
  account_name: string;
  account_number: string;
  bank: string;
  payment_channel: string;
  onboarding_level: number;
  media: string[];
}

export interface DoctorCard {
  _id: string;
  name: string;
  doctorInfo: DoctorInfo;
  image: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  role: "doctor" | "patient" | null;
  languages: string[];
  address_1: string;
  address_2: string;
  country: string;
  region: string;
  city: string;
  dob: Date;
  phone: string;
  gender: string;
  doctorInfo: DoctorInfo;
  onboarding_level: number;
}

export interface Appointment {
  id: string;
  doctor: {
    doctorId: string;
    name?: string;
    image?: string;
  };
  reference: string;
  patient: {
    patientId: string;
    name: string;
    image: string;
  };
  // transactionId: string;
  date: string;
  timeSlot: {
    startTime: string;
    endTime: string;
    slotId: string;
  };
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;

  mode: "online" | "in-person";
  online_medium?: "video" | "audio" | "chat";
  paid: boolean;
  room: {
    name: string;
    sid: string;
    maxParticipants: number;
  };
  slotId: string;
}
export interface ServiceCard {
  title: string;
  icon: React.ReactNode;
  description: string;
  footer: string;
}

type PaymentMethod = "card" | "bank_transfer" | "mobile_money";
export type MobileMoneyType = "MTN" | "Vodafone" | "";

export interface Transaction {
  id: string;
  appointmentId: string;
  purpose: "Online Consultation";
  patientId: string;
  doctorId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  channel: PaymentMethod;
  mobileMoneyType?: MobileMoneyType;
  createdAt?: Date;
  updatedAt?: Date;
  IpAddress: string;
  reference: string;
  paidAt: string;
  receiptNumber: string;
}

export interface dataReturn {
  status: "success" | "fail";
  message: string;
  statusCode: number;
}

export interface ErrorReturn extends dataReturn {
  error: any;
  type: any;
}

export interface SuccessReturn extends dataReturn {
  data: any;
}
export type ReturnType = ErrorReturn | SuccessReturn;

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role?: "doctor" | "patient" | null;
  languages?: string[];
  country?: string;
  region?: string;
  city?: string;
  dob?: Date;
  phone?: string;
  gender?: string;
  doctorInfo?: DoctorInfo; // Optional for patients
}

export interface AvailabilityType {
  id: string;
  doctorId: string;
  date: Date;
  timeSlots: ITimeSlot[];
}

export interface DoctorCard {
  id: string;
  name: string;
  doctorInfo: DoctorInfo;
  image: string;
}
export interface VerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    receipt_number: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: PaymentMethod;
    currency: string;
    ip_address: string;
    metadata: {
      patientId: string;
      patient_name: string;
      patient_email: string;
    };
    log: {
      start_time: number;
      time_spent: number;
      attempts: number;
      errors: number;
      success: boolean;
      mobile: boolean;
      input: any[];
      history: {
        type: string;
        message: string;
        time: number;
      }[];
    };
    fees: number;
    fees_split: any | null;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string | null;
      account_name: string | null;
      mobile_money_number: string;
      receiver_bank_account_number: string | null;
      receiver_bank: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any | null;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: any | null;
    split: any;
    order_id: string | null;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any | null;
    source: any | null;
    fees_breakdown: any | null;
    connect: any | null;
    transaction_date: string;
    plan_object: any;
    subaccount: any;
  };
}
