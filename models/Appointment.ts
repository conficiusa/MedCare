import { IAppointment } from "@/lib/definitions";
import { models, Schema, model } from "mongoose";

const AppointmentSchema = new Schema<IAppointment>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Transaction",
    },
    doctor: {
      doctorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      name: { type: String, required: true },
      image: { type: String },
    },
    patient: {
      patientId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      name: { type: String, required: true },
      image: { type: String },
    },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    mode: {
      type: String,
      enum: ["online", "in-person"],
      required: true,
    },
    online_medium: {
      type: String,
      enum: ["video", "audio", "chat"],
      required() {
        return this.mode === "online";
      },
    },
    date: {
      type: Date,
      required: true,
    },
    paid: { type: Boolean, default: false },
    room: {
      name: { type: String, required: true },
      sid: { type: String, required: true },
      maxParticipants: { type: Number, required: true },
    },
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
        ret.doctor.doctorId = ret.doctor.doctorId.toString();
        ret.patient.patientId = ret.patient.patientId.toString();
        ret.transactionId = ret.transactionId.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

AppointmentSchema?.index({ doctorId: 1, date: 1, time: 1 });
const Appointment =
  models.Appointment || model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
