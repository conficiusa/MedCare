import { Model, model, models, Schema } from "mongoose";
import { IPatientProfile } from "@/lib/definitions";
import { string } from "zod";

const PatientSchema = new Schema<IPatientProfile, Model<IPatientProfile>>(
  {
    conditions: {
      type: [String],
    },
    medicalHistory: {
      type: String,
    },
    userId: {
      type: String,
      ref: "User",
      required: true, // Ensures that every profile is linked to a user
    },
  },
  {
    timestamps: true,
  }
);

const Patient =
  models.Patient || model<IPatientProfile>("Patient", PatientSchema);
export default Patient;
