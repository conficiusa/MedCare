import { Document, ObjectId, Types } from "mongoose";
import React from "react";

//////////Mongoose definitions///////////
//////////Mongoose definitions///////////
//////////Mongoose definitions///////////
//////////Mongoose definitions///////////☻
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

// Doctor profile interface, extending the user
export interface DoctorInfo {
  specialties: string[];
  experience: string;
  rate: number;
  certifications?: string[];
  rating?: number;
  bio: string;
}

// Patient profile interface, extending the user
export interface IPatientProfile extends IUser {
  conditions?: string[];
  medicalHistory?: string;
  userId?: ObjectId | string;
}

////////////Application definitions///////////
////////////Application definitions///////////
////////////Application definitions///////////
////////////Application definitions///////////
////////////Application definitions///////////

export interface ServiceCard {
  title: string;
  icon: React.ReactNode;
  description: string;
  footer: string;
}

export interface IAvailability {
  doctorId: Types.ObjectId;
  date: Date;
  timeSlots: string[];
}
