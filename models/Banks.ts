import { IBank } from "@/lib/definitions";
import { models, Schema, model } from "mongoose";

const BanksSchema = new Schema<IBank>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    code: { type: String, required: true },
    longcode: { type: String, required: true },
    gateway: { type: String, required: true },
    pay_with_bank: { type: Boolean, required: true },
    supports_transfer: { type: Boolean, required: true },
    active: { type: Boolean, required: true },
    country: { type: String, required: true },
    currency: { type: String, required: true },
    type: { type: String, enum: ["ghipss", "mobile_money"], required: true },
    isdeleted: { type: Boolean, required: true },
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

BanksSchema?.index({ code: 1 });
const Banks = models.Banks || model<IBank>("Banks", BanksSchema);

export default Banks;
