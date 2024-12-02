import { Schema } from "mongoose";
import { IPatientInfo } from "@/lib/definitions";

export const PatientInfoSchema = new Schema<IPatientInfo>(
  {
    conditions: {
      type: [String],
    },
    medicalHistory: {
      type: String,
    },
  },
  {
    _id: false,
  }
);
