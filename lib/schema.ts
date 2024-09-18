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
  password: z.string().min(1, "Please enter your password"),
});

export const PatientOnboardingSchema = z.object({
  languages: z
    .array(multiSelectSchema)
    .min(1, "Please select a language")
    .max(4, "You can only select up to 4 languages"),
  gender: z.string().min(1, "Please enter your gender"),
  phone: z.string(),
  dob: z
    .date()
    .refine((date) => date <= new Date(), "Please enter a valid date of birth"),
  role: z.string().min(1, "Please enter your role"),
  region: z.string().min(1, "Please enter your region"),
  city: z.string().min(1, "Please enter your city/town"),
  digitalAddress: z.string().min(1, "Please enter your digital address"),
  street: z.string().min(1, "Please enter your street"),
  country: z.string().min(1, "Please enter your country"),
  conditions: z
    .array(multiSelectSchema)
    .max(6, "You can only select up to 6 conditions"),
  medicalHistory: z
    .string()
    .max(900, "Medical history must be less than 300 characters"),
});
