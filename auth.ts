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
    role?: string | undefined;
    id?: string | undefined;
  }

  interface Session {
    user: {
      role?: string | undefined;
      id?: string | undefined;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string | undefined;
    id?: string | undefined;
  }
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
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
            return { ...userWithoutPassword, id: user._id.toString() };
          }
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      await connectToDatabase();
      const existingOauthUser = await User.findOne({ email: user?.email });
      if (user) {
        token.role = user?.role || "";
        token.id = user?.id || "";
      }
      if (existingOauthUser) {
        token.id = existingOauthUser._id.toString();
        token.role = existingOauthUser.role || "";
      }
      if (trigger === "update" && session) {
        console.log("incoming session", session);
        token = {
          ...token,
          role: session?.user?.role,
          user: { ...session?.user },
        };
        console.log("transformed token", token);
        return token;
      }
      return token;
    },
    async session({ session, token, trigger }) {
      // Add role to the session object
      if (token) {
        session.user.id = token?.id || "";
        session.user.role = token?.role;
      }
      if (trigger === "update") {
        session.user.role = token?.role;
        session.user.id = token?.id || "";
        console.log("transformed session", session);
        return session;
      }
      return session;
    },
  },
  adapter: MongoDBAdapter(client, {
    databaseName: "Medcare",
  }),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
