import type { NextAuthConfig } from "next-auth";
import { getToken } from "next-auth/jwt";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
    newUser: "/onboarding",
  },
  //refer to https://github.com/nextauthjs/next-auth/discussions/9133 in production
  callbacks: {
    //protect pages and redirect to unboarding
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
      const isProfileCompleted = !!token?.role;

      const protectedPaths = [
        "/onboarding",
        "/find-a-doctor",
        "/profile",
        "/settings",
        "/admin",
        "/consultation",
        "/dashboard",
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

      if (isProtectedPath) {
        if (isLoggedIn) {
          if (isProfileCompleted) {
            if (request.nextUrl.pathname === "/onboarding") {
              return Response.redirect(
                new URL("/find-a-doctor", request.nextUrl)
              );
            }
            return true;
          }
          if (!isOnboardingPath) {
            return Response.redirect(new URL("/onboarding", request.nextUrl));
          }
          return true; // Allow navigation within the onboarding flow// Avoid loop by only redirecting if not already on /onboarding
        }
        if (request.nextUrl.pathname !== "/sign-in") {
          return Response.redirect(
            new URL(`/sign-in?redirect=${request?.nextUrl}`, request.nextUrl)
          );
        }
        return true; // Avoid loop by only redirecting if not already on /login
      } else if (isLoggedIn && request.nextUrl.pathname !== "/find-a-doctor") {
        return Response.redirect(new URL("/find-a-doctor", request.nextUrl));
      }

      return true;
    },
  },
  providers: [],
};
