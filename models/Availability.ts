// @/models/availability.schema.ts

import mongoose, { Schema } from "mongoose";
import { IAvailability } from "@/lib/definitions";

const availabilitySchema = new Schema<IAvailability>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: Date, required: true },
    timeSlots: { type: [String], required: true }, // Array of time slots like ["09:00-10:00"]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Index the `date` field for faster querying by date
// availabilitySchema.index({ date: 1 });
const Availability =
  mongoose.models.Availability ||
  mongoose.model<IAvailability>("Availability", availabilitySchema);

export default Availability;
