import { channel } from "diagnostics_channel";
import { m } from "framer-motion";
import { z } from "zod";

const multiSelectSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(1, "Please enter your full name.")
      .min(2, { message: "Please enter a valid name." }),
    email: z
      .string()
      .min(1, "please enter your email")
      .email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, "please enter your email")
    .email("Please enter a valid email"),
});

export const PatientOnboardingSchema = z.object({
  languages: z
    .array(multiSelectSchema)
    .min(1, "Please select a language")
    .max(4, "You can only select up to 4 languages"),
  gender: z.string().min(1, "Please enter your gender"),
  phone: z.string(),
  image: z
    .string()
    .nullable()
    .refine(
      (file) => {
        if (!file) return true;
        // Determine the Base64 prefix length dynamically
        const base64Prefix = file.substring(0, file.indexOf(",") + 1);
        const base64Length = file.length - base64Prefix.length;
        const sizeInBytes = (base64Length * 3) / 4;
        return sizeInBytes < 4000000; // 4MB
      },
      {
        message: "File size must be less than 4MB",
        path: ["image"],
      }
    ),
  dob: z
    .date({
      required_error: "Please enter your date of birth",
    })
    .nullable()
    .refine(
      (date) => date && date <= new Date(),
      "Please enter a valid date of birth"
    )
    .refine(
      (date) => !date || date >= new Date(1900, 1, 1),
      "Please enter a valid date of birth"
    ),
  role: z.string().min(1, "Please enter your role"),
  region: z.string().min(1, "Please enter your region"),
  city: z.string().min(1, "Please enter your city/town"),
  country: z.string().min(1, "Please enter your country"),
  conditions: z
    .array(multiSelectSchema)
    .max(6, "You can only select up to 6 conditions"),
  medicalHistory: z
    .string()
    .max(900, "Medical history must be less than 300 characters"),
});

export const CheckoutSchema = z.object({
  fullName: z.string().min(1, "Please enter your full name."),
  email: z
    .string()
    .min(1, "please enter your email")
    .email("Please enter a valid email address."),
  channel: z.enum(["mobile_money", "card"]),
  amount: z.number().int().positive("Amount must be greater than zero"),
  mobileMoneyType: z.enum(["mtn", "airteltigo", "telecel_cash"]).optional(),
}).refine((data) => {
  if (data.channel === "mobile_money" && !data.mobileMoneyType) {
    return false;
  }
  return true;
}, {
  message: "Mobile money type is required when the channel is mobile money",
  path: ["mobileMoneyType"],
});
