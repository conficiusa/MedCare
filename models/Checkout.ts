import { ICheckout } from "@/lib/definitions";
import mongoose, { Schema } from "mongoose";

const CheckoutSchema = new Schema<ICheckout>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      required: true,
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
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer", "mobile_money"],
      required: true,
    },
    mobileMoneyType: {
      type: String,
      enum: ["mtn", "telecel", "airteltigo"],
      // Custom validation: Only required if paymentMethod is 'mobile_money'
      validate: {
        validator: function (this: ICheckout) {
          return (
            this.paymentMethod !== "mobile_money" || !!this.mobileMoneyType
          );
        },
        message:
          "mobileMoneyType is required when paymentMethod is mobile_money",
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Pre-save hook to update the `updatedAt` field
CheckoutSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Checkout = mongoose.model<ICheckout>("Checkout", CheckoutSchema);

export default Checkout;
