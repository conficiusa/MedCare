"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { SignInSchema } from "@/lib/schema";
import connectToDatabase from "@/lib/mongoose";
import { z } from "zod";

export type State = {
  message: string | undefined;
  errors?: {
    email?: string[];
    password?: string[];
  };
  // fields?: Record<string, string>;
};

export async function emailAuth(email: z.output<typeof SignInSchema>) {
  try {
    await connectToDatabase().catch((error: any) => {
      return {
        message: "Unable to Connect to server",
        type: "Server Error",
      };
    });
    const parsed = SignInSchema.safeParse(email);
    if (!parsed.success) {
      return {
        errors: parsed.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Sign In.",
        type: "ValidationError",
      };
    }
    await signIn("nodemailer", parsed.data);
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid Credentials",
            type: "Credentials Error",
          };
        case "CallbackRouteError":
          return {
            message:
              "This account was likely created with a different provider.",
            type: "Callback Error",
          };
        default:
          return {
            message: "An unexpected error occurred.",
            type: "Unexpected Error",
          };
      }
    }
    throw error;
  }
}
// export async function authenticate(
//   prevState: State,
//   formData: FormData
// ): Promise<State> {
//   try {
//     await connectToDatabase().catch((error: any) => {
//       return { message: "Unable to Connect to server" };
//     });
//     const data = Object.fromEntries(formData);
//     const parsed = SignInSchema.safeParse(data);

//     if (!parsed.success) {
//       return {
//         errors: parsed.error.flatten().fieldErrors,
//         message: "Missing Fields. Failed to Sign In.",
//       };
//     }
//     const password = parsed.data.password;
//     const email = parsed.data.email;
//     const foundUser = await User.findOne({ email });
//     const role = foundUser?.role;
//     let callbackUrl = "/find-a-doctor";
//     if (!role) {
//       callbackUrl = "/onboarding";
//     }
//     await signIn("credentials", {
//       callbackUrl,
//       redirectTo: callbackUrl,
//       email,
//       password,
//     });
//     return {
//       message: undefined,
//     };
//   } catch (error: any) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return {
//             message: "Invalid Credentials",
//           };
//         case "CallbackRouteError":
//           return {
//             message:
//               "This account was likely created with a different provider.",
//           };
//         default:
//           return {
//             message: "An unexpected error occurred.",
//           };
//       }
//     }
//     throw error;
//   }
// }

export const googleSignIn = async () => {
  try {
    await signIn("google", {
      callbackUrl: "/find-a-doctor",
      redirectTo: "/find-a-doctor",
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "OAuthSignInError":
          return {
            message: "Could not sign in with Google",
          };
        case "CallbackRouteError":
          return {
            message: "This email is linked to a another account",
          };
        default:
          return {
            message: "An unexpected error occurred.",
          };
      }
    }
    throw error;
  }
};
