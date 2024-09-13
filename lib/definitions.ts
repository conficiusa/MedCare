import { Document } from "mongoose";

export type ServiceCard = {
  title: string;
  icon: React.ReactNode;
  description: string;
  footer: string;
}[];

export type Faq = {
  question: string;
  answer: string;
}[];

//mongoose types definitions
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  confirmPassword: string | undefined;
  role?: "doctor" | "patient";
  languages?: string[];
  Country?: string;
  Region?: string;
  City?: string;
}

export interface IDoctorProfile extends IUser {
  rate?: number;
  description?: string;
  certifications?: string[];
  specializations?: string[];
}

export interface IPatientProfile extends IUser {
  age?: number;
  conditions?: string;
}
