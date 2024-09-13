import { Model, model, models, Schema } from "mongoose";
import { IDoctorProfile, IPatientProfile, IUser } from "@/lib/definitions";
import bcrypt from "bcrypt";

const UserSchema = new Schema<IUser, Model<IUser>>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    languages: {
      type: [String],
    },
    Country: {
      type: String,
    },
    Region: {
      type: String,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  console.log("pre save hook");
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

//doctor schema
const DoctorSchema = new Schema<IDoctorProfile, Model<IDoctorProfile>>(
  {
    rate: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    certifications: {
      type: [String],
    },
    specializations: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

//patient schema
const PatientSchema = new Schema<IPatientProfile, Model<IPatientProfile>>({
  age: {
    type: Number,
  },
  conditions: {
    type: String,
  },
});

//discrimators

const User = models.User || model<IUser>("User", UserSchema);
export const Doctor =
  models.User.discriminators?.Doctor ||
  User.discriminator<IDoctorProfile, Model<IDoctorProfile>>(
    "Doctor",
    DoctorSchema
  );
export const Patient =
  models.User.discriminators?.Patient ||
  User.discriminator<IPatientProfile, Model<IPatientProfile>>(
    "Patient",
    PatientSchema
  );

export default User;
