import type { NextAuthConfig, User, Account, Profile } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/signin",
    newUser: "/onboarding",
  },
  events: {
    async signIn({ isNewUser }) {
      console.log("User signed in", isNewUser);
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = [
        "/onboarding",
        "/find-a-doctor",
        "/profile",
        "/settings",
        "/admin",
      ];
      const isProtectedPath = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtectedPath) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/find-a-doctor", nextUrl));
      }
      return true;
    },
  },
  providers: [Google],
};
