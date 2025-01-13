import type { NextAuthConfig } from "next-auth";
import { getToken } from "next-auth/jwt";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
    newUser: "/onboarding",
  },
  // Refer to https://github.com/nextauthjs/next-auth/discussions/9133 in production
  callbacks: {
    async authorized({ auth, request }) {
      const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET as string,
        secureCookie: process.env.NODE_ENV === "production",
      });

      const currentPath = request.nextUrl.pathname;
      const isLoggedIn = !!auth?.user;
      const role = token?.role as "doctor" | "patient";
      const onboardingLevel = Number(token?.onboarding_level);
      const doctorVerification = token?.doctorInfo?.verification;
      const isDoctor = role === "doctor";
      const isProfileCompleted = isDoctor
        ? onboardingLevel === 7
        : onboardingLevel === 5;

      const protectedPaths = [
        "/onboarding",
        "/find-a-doctor",
        "/profile",
        "/settings",
        "/admin",
        "/consultation",
        "/dashboard",
        "/doctor",
      ];

      const onboardingPaths = [
        "/onboarding",
        "/onboarding/patient",
        "/onboarding/doctor",
      ];

      const isProtectedPath = protectedPaths.some((path) =>
        currentPath.startsWith(path)
      );
      const isOnboardingPath = onboardingPaths.some((path) =>
        currentPath.startsWith(path)
      );

      // Redirect logic for doctors in "verifying" state
      if (
        isDoctor &&
        doctorVerification === "verifying" &&
        currentPath !== "/onboarding/doctor/awaiting-verification"
      ) {
        console.log(currentPath)
        return Response.redirect(
          new URL("/onboarding/doctor/awaiting-verification", request.nextUrl)
        );
      }

      // Redirect unauthorized users accessing protected paths
      if (isProtectedPath) {
        if (!isLoggedIn) {
          return Response.redirect(
            new URL(`/sign-in?redirect=${currentPath}`, request.nextUrl)
          );
        }
        if (!isProfileCompleted && !isOnboardingPath) {
          return Response.redirect(new URL("/onboarding", request.nextUrl));
        }
      }

      // Redirect to dashboards after sign-in
      if (isLoggedIn && currentPath === "/") {
        const dashboardPath = isDoctor
          ? "/doctor/dashboard/appointments"
          : "/find-a-doctor";
        return Response.redirect(new URL(dashboardPath, request.nextUrl));
      }

      return true; // Allow other paths
    },
  },
  providers: [],
};
