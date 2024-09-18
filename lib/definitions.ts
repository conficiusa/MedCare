import { Document, ObjectId } from "mongoose";
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
  street?: string;
  digitalAddress?: string;
  phone?: string;
  gender?: string;
}

// Doctor profile interface, extending the user
export interface IDoctorProfile extends IUser {
  rate?: number;
  description?: string;
  certifications?: string[];
  specializations?: string[];
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
