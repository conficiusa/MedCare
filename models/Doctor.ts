import { DoctorInfo } from "@/lib/definitions";
import { Schema } from "mongoose";

export const DoctorInfoSchema = new Schema<DoctorInfo>(
  {
    specialties: {
      type: [String],
      required: [true, "Specialties are required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
    },
    certifications: {
      type: [String],
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
    },
    // Add other doctor-specific fields here
  },
  { _id: false } // Prevents creation of an additional _id field for subdocuments
);
