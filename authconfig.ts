import type { NextAuthConfig } from "next-auth";
import { getToken } from "next-auth/jwt";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
    newUser: "/onboarding",
  },
  //refer to https://github.com/nextauthjs/next-auth/discussions/9133 in production
  callbacks: {
    async authorized({ auth, request }) {
      const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET as string,
        salt: "authjs.session-token",
      });
      const isLoggedIn = !!auth?.user;
      const isProfileCompleted = !!token?.role;

      const protectedPaths = [
        "/onboarding",
        "/find-a-doctor",
        "/profile",
        "/settings",
        "/admin",
      ];
      const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      );

      console.log(request.nextUrl);
      if (isProtectedPath) {
        if (isLoggedIn) {
          if (isProfileCompleted) {
            return true;
          }
          if (request.nextUrl.pathname !== "/onboarding") {
            return Response.redirect(new URL("/onboarding", request.nextUrl));
          }
          return true; // Avoid loop by only redirecting if not already on /onboarding
        }
        if (request.nextUrl.pathname !== "/login") {
          return Response.redirect(new URL("/login", request.nextUrl));
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
