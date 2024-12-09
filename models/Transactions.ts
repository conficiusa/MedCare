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
    reference: { type: String, required: true },
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
    cardType: {
      type: String,
      required: function (this: ITransaction) {
        return this.channel === "card";
      },
      validate: {
        validator: function (this: ITransaction, value: string) {
          if (this.channel !== "card") return true;
          return ["visa", "mastercard"].includes(value);
        },
        message: "Invalid cardType for card transactions",
      },
    },
    mobileMoneyType: {
      type: String,
      required: function (this: ITransaction) {
        return this.channel === "mobile_money";
      },
      validate: {
        validator: function (this: ITransaction, value: string) {
          if (this.channel !== "mobile_money") return true;
          return ["MTN", "Vodafone", "AirtelTigo"].includes(value);
        },
        message: "Invalid mobileMoneyType for mobile money transactions",
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
