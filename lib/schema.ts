import { string, z } from "zod";
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
