import { Model, model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "@/lib/definitions";
import { DoctorInfoSchema } from "@/models/Doctor";

// User Schema
const UserSchema = new Schema<IUser, Model<IUser>>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match!",
      },
    },
    role: {
      type: String,
      enum: ["doctor", "patient"],
      required: function (this: IUser) {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    languages: {
      type: [String],
      required: function (this: IUser) {
        return this.isNew ? false : true; // Required during onboarding, not at initial signup
      },
    },
    country: {
      type: String,
      required: function (this: IUser) {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    region: {
      type: String,
      required: function (this: IUser) {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    dob: {
      type: Date,
      required: function (this: IUser) {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    city: {
      type: String,
      required: function (this: IUser) {
        return this.isNew ? false : true; // Required during onboarding
      },
    },

    image: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: function (this: IUser) {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    phone: {
      type: String,
      required: function (this: IUser) {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    doctorInfo: {
      type: DoctorInfoSchema,
      required: function () {
        return this.role === "doctor";
      },
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing before save
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
UserSchema.pre<IUser>("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }
  if (this.isModified("region")) {
    this.region = this.region + " Region";
  }
  next();
});

UserSchema.index({ role: 1 });
const User = models.User || model<IUser>("User", UserSchema);

export default User;
