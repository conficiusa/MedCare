import type { NextAuthConfig } from "next-auth";
import { getToken } from "next-auth/jwt";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
    newUser: "/onboarding",
  },
  // Refer to https://github.com/nextauthjs/next-auth/discussions/9133 in production
  callbacks: {
    // Protect pages and redirect to onboarding
    async authorized({ auth, request }) {
      const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET as string,
        secureCookie: process.env.NODE_ENV === "production",
        salt:
          process.env.NODE_ENV === "production"
            ? "__Secure-authjs.session-token"
            : "authjs.session-token",
      });

      const isLoggedIn = !!auth?.user;
      const role = token?.role as "doctor" | "patient";
      const onboardingLevel = Number(token?.onboarding_level);
      const isProfileCompleted = (role: "doctor" | "patient") =>
        role === "doctor" ? onboardingLevel === 7 : onboardingLevel === 4;

      const protectedPaths = [
        "/onboarding",
        "/find-a-doctor",
        "/profile",
        "/settings",
        "/admin",
        "/consultation",
        "/dashboard",
        "/doctor"
      ];
      const onboardingPaths = [
        "/onboarding",
        "/onboarding/patient",
        "/onboarding/doctor",
      ];
      const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      );
      const isOnboardingPath = onboardingPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      );
      const isDoctor = role === "doctor";
      const doctorVerification = token?.doctorInfo?.verification;
      const currentPath = request.nextUrl.pathname;

      if (isProtectedPath) {
        if (isLoggedIn) {
          if (isProfileCompleted(role)) {
            if (currentPath === "/onboarding") {
              if (isDoctor) {
                console.log(role);
                switch (doctorVerification) {
                  case "approved":
                    return Response.redirect(
                      new URL("/doctor/dashboard", request.nextUrl)
                    );
                  case "verifying":
                    return Response.redirect(
                      new URL(
                        "/onboarding/doctor/awaiting-verification",
                        request.nextUrl
                      )
                    );
                  case "failed":
                    return Response.redirect(
                      new URL(
                        "/onboarding/doctor/verification-failed",
                        request.nextUrl
                      )
                    );
                  default:
                    throw new Error("Invalid onboarding data", {
                      cause: "The verification status could not be determined",
                    });
                }
              } else {
                return Response.redirect(
                  new URL("/find-a-doctor", request.nextUrl)
                );
              }
            }
            return true;
          } else if (!isOnboardingPath) {
            return Response.redirect(new URL("/onboarding", request.nextUrl));
          }
          return true; // Allow navigation within the onboarding flow
        } else {
          if (currentPath !== "/sign-in") {
            return Response.redirect(
              new URL(`/sign-in?redirect=${currentPath}`, request.nextUrl)
            );
          }
          return true; // Avoid loop by only redirecting if not already on /sign-in
        }
      } else if (isLoggedIn) {
        if (isDoctor) {
          return Response.redirect(
            new URL("/doctor/dashboard", request.nextUrl)
          );
        } else {
          return Response.redirect(new URL("/find-a-doctor", request.nextUrl));
        }
      }

      return true;
    },
  },
  providers: [],
};
