"use server";
import { auth, signIn, } from "@/auth";
import { AuthError } from "next-auth";
import { SignInSchema } from "@/lib/schema";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

export type State = {
  message: string | undefined;
  errors?: {
    email?: string[];
    password?: string[];
  };
  // fields?: Record<string, string>;
};

export async function authenticate(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    await connectToDatabase().catch((error:any) => {
      return {message:"Unable to Connect to server"}
    });
    const data = Object.fromEntries(formData);
    const parsed = SignInSchema.safeParse(data);

    if (!parsed.success) {
      return {
        errors: parsed.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Sign In.",
      };
    }
    const password = parsed.data.password;
    const email = parsed.data.email;
    const foundUser = await User.findOne({ email });
    const role = foundUser?.role;
    let callbackUrl = "/find-a-doctor";
    if (!role) {
      callbackUrl = "/onboarding";
    }
    await signIn("credentials", {
      callbackUrl,
      redirectTo: callbackUrl,
      email,
      password,
    });
    return {
      message: undefined,
    };
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid email or password.",
          };
        default:
          return {
            message: "An unexpected error occurred.",
          };
      }
    }
    throw error;
  }
}

// export async function UpdatePatientSession() {
//   const session = await auth();

//   await update({ ...user, name: "Serverserver-man" });
// }
