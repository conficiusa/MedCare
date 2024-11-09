import { IAvailability, ITimeSlot } from "@/lib/definitions";
import mongoose, { Schema } from "mongoose";

// Define the schema with the updated time slot structure
const timeSlotSchema = new Schema<ITimeSlot>(
  {
    slotId: { type: String, required: true }, // Unique ID for each slot
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    patientId: { type: String, ref: "Patient", default: null },
    cancellationReason: { type: String, default: null },
    rescheduledTo: {
      type: {
        date: Date,
        startTime: String,
        endTime: String,
      },
      default: null,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false } // Disable _id for nested schema to avoid redundancy
);

const availabilitySchema = new Schema<IAvailability>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: Date, required: true },
    timeSlots: { type: [timeSlotSchema], required: true },
    expiresAt: { type: Date, required: true }, // TTL expiration field
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
        ret.doctorId = ret.doctorId.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Automatically set `expiresAt` based on `date` to one day after
availabilitySchema.pre("save", function (next) {
  this.expiresAt = new Date(this.date);
  this.expiresAt.setDate(this.expiresAt.getDate() + 1); // Set TTL to 1 day after the scheduled date
  next();
});

// TTL index for automatic deletion based on `expiresAt`
availabilitySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index the `date` and `doctorId` fields for efficient querying
availabilitySchema.index({ date: 1, doctorId: 1 });

const Availability =
  mongoose.models.Availability ||
  mongoose.model<IAvailability>("Availability", availabilitySchema);

export default Availability;
