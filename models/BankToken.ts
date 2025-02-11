import { IBankTokenType } from "@/lib/definitions";
import { models, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const BankTokenSchema = new Schema<IBankTokenType>(
  {
    email: { type: String, required: true }, // Email of the user
    token: { type: String, required: true }, // Token
    expiresAt: { type: Date, required: true }, // Expiration time
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }, // Timestamp
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

// Add pre-save middleware to hash the token
BankTokenSchema.pre("save", async function (next) {
  // Hash the token if it's new or modified
  if (!this.isNew && !this.isModified("token")) return next();

  try {
    // Generate salt and hash the token
    const salt = await bcrypt.genSalt(10);
    this.token = await bcrypt.hash(this.token, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

BankTokenSchema?.index({ email: 1 });
const BankToken =
  models.BankToken || model<IBankTokenType>("BankToken", BankTokenSchema);

export default BankToken;
