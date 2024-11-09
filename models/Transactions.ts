import { ITransaction } from "@/lib/definitions";
import mongoose, { Schema, models } from "mongoose";

const CheckoutSchema = new Schema<ITransaction>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
    patientId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    channel: {
      type: String,
      enum: ["card", "bank_transfer", "mobile_money"],
      required: true,
    },
    mobileMoneyType: {
      type: String,
      enum: ["MTN", "Vodafone", "AirtelTigo"],
      // Custom validation: Only required if paymentMethod is 'mobile_money'
      validate: {
        validator: function (this: ITransaction) {
          return this.channel !== "mobile_money" || !!this.mobileMoneyType;
        },
        message:
          "mobile money provider is required for mobile money transactions",
      },
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
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Transaction =
  models.Transaction ||
  mongoose.model<ITransaction>("Transaction", CheckoutSchema);

export default Transaction;
