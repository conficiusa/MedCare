import { IAppointment } from "@/lib/definitions";
import { models, Schema, model } from "mongoose";

const AppointmentSchema = new Schema<IAppointment>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Transaction",
    },
    patientId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    doctorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    time: { type: String, required: true },
    date: {
      type: Date,
      required: true,
    },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save hook to update the `updatedAt` field
AppointmentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Appointment =
  models.Appointment || model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
