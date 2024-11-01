import { Document, ObjectId, Types } from "mongoose";
import React from "react";

//////////Mongoose definitions///////////
// User interface, reflecting initial sign-up and onboarding
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  confirmPassword: string | undefined;
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

export interface ITransaction extends Document {
  appointmentId?: ObjectId;
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
export interface IAppointment extends Document {
  patientId: ObjectId;
  doctorId: ObjectId;
  transactionId: ObjectId;
  date: Date;
  time: string;
  status: "pending" | "completed" | "cancelled";
  paid: boolean;
  mode: "online" | "in-person";
  online_medium?: "video" | "audio" | "chat";
}

// Patient profile interface, extending the user
export interface IPatientProfile extends IUser, Document {
  conditions?: string[];
  medicalHistory?: string;
  userId?: ObjectId | string;
}

////////////Application definitions///////////
////////////Application definitions///////////
////////////Application definitions///////////
////////////Application definitions///////////
////////////Application definitions///////////

export interface DoctorInfo {
  specialties: string[];
  experience: string;
  rate: number;
  certifications?: string[];
  rating?: number;
  bio: string;
}

export interface DoctorCard {
  _id: string;
  name: string;
  doctorInfo: DoctorInfo;
  image: string;
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  role: "doctor" | "patient" | null;
  languages: string[];
  country: string;
  region: string;
  city: string;
  dob: Date;
  phone: string;
  gender: string;
  doctorInfo: DoctorInfo;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  transactionId: string;
  date: string;
  time: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  mode: "online" | "in-person";
  online_medium?: "video" | "audio" | "chat";
  paid: boolean;
}
export interface ServiceCard {
  title: string;
  icon: React.ReactNode;
  description: string;
  footer: string;
}

export interface IAvailability extends Document {
  doctorId: ObjectId
  date: Date;
  timeSlots: string[];
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
  paidAt: string;
  receiptNumber: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
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

// Doctor profile interface, extending the user
export interface DoctorInfo {
  specialties: string[];
  experience: string;
  rate: number;
  certifications?: string[];
  rating?: number;
  bio: string;
}

export interface AvailabilityType {
  id: string;
  doctorId: string;
  date: Date;
  timeSlots: string[];
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
