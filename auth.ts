import NextAuth, { type DefaultSession } from "next-auth";
import { authConfig } from "@/authconfig";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongodb";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongoose";
import { JWT } from "next-auth/jwt"; // Import the JWT type

// Extending the default User type to include 'role'
declare module "next-auth" {
  interface User {
    role: string | undefined;
  }

  interface Session {
    user: {
      role: string | undefined;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string | undefined;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        await connectToDatabase();
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await User.findOne({ email });
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            const { password, ...userWithoutPassword } = user.toObject();
            return userWithoutPassword;
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If it's the first time JWT is being created
      if (user?.role) {
        token.role = user?.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to the session object
      if (token?.role) {
        session.user.role = token?.role;
      }
      return session;
    },
  },
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
