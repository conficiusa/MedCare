import mongoose, { Model, model, models, Schema } from "mongoose";
import { IDoctorProfile } from "@/lib/definitions";
import User from "@/models/User";

const DoctorSchema = new Schema<IDoctorProfile, Model<IDoctorProfile>>(
  {
    rate: {
      type: Number,
      required: [true, "Rate is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    certifications: {
      type: [String],
      required: [true, "Certifications are required."],
    },
    specializations: {
      type: [String],
      required: [true, "Specializations are required."],
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = models?.Doctor || model<IDoctorProfile>("Doctor", DoctorSchema);
export default Doctor;
