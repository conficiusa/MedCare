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
import Resend from "next-auth/providers/resend"


// Extending the default User type to include 'role'
declare module "next-auth" {
  interface User {
    role?: string | undefined;
    id?: string | undefined;
    region?: string | undefined;
    city?: string | undefined;
    street?: string | undefined;
    digitalAddress?: string | undefined;
    phone?: string | undefined;
    languages?: string[] | undefined;
    dob?: Date | undefined;
    gender?: string | undefined;
  }

  interface Session {
    user: {
      role?: string | undefined;
      id?: string | undefined;
      region?: string | undefined;
      city?: string | undefined;
      street?: string | undefined;
      digitalAddress?: string | undefined;
      phone?: string | undefined;
      languages?: string[] | undefined;
      dob?: Date | undefined;
      gender?: string | undefined;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string | undefined;
    id?: string | undefined;
    region?: string | undefined;
    city?: string | undefined;
    street?: string | undefined;
    digitalAddress?: string | undefined;
    phone?: string | undefined;
    languages?: string[] | undefined;
    dob?: Date;
    gender?: string | undefined;
  }
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Resend({
      from: "no-reply@medcare.onresend.com",
    }),
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
        token.region = existingOauthUser.region || "";
        token.city = existingOauthUser.city || "";
        token.street = existingOauthUser.street || "";
        token.digitalAddress = existingOauthUser.digitalAddress || "";
        token.phone = existingOauthUser.phone || "";
        token.languages = existingOauthUser.languages || [];
        token.dob = existingOauthUser.dob || "";
        token.gender = existingOauthUser.gender || "";
      }
      if (trigger === "update" && session) {
        const updatedUser = await User.findOne({ email: session?.user.email });
        console.log("incoming session", session);
        console.log("updatedUser", updatedUser);
        token = {
          ...token,
          role: session?.user?.role,
          region: updatedUser?.region,
          city: updatedUser?.city,
          street: updatedUser?.street,
          digitalAddress: updatedUser?.digitalAddress,
          phone: updatedUser?.phone,
          languages: updatedUser?.languages,
          gender: updatedUser?.gender,
          dob: updatedUser?.dob,
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
        session.user.region = token?.region;
        session.user.city = token?.city;
        session.user.street = token?.street;
        session.user.digitalAddress = token?.digitalAddress;
        session.user.phone = token?.phone;
        session.user.languages = token?.languages;
        session.user.dob = token?.dob;
        session.user.gender = token?.gender;
        console.log("transformed session", session);
      }
      if (trigger === "update") {
        session.user.role = token?.role;
        session.user.id = token?.id || "";
        session.user.region = token?.region;
        session.user.city = token?.city;
        session.user.street = token?.street;
        session.user.digitalAddress = token?.digitalAddress;
        session.user.phone = token?.phone;
        session.user.languages = token?.languages;
        session.user.dob = token?.dob;
        session.user.gender = token?.gender;
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
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
});
