import NextAuth, { type DefaultSession } from "next-auth";
import { authConfig } from "@/authconfig";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongodb";
import Google from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/nodemailer";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongoose";

// Extending the default User type to include 'role'
declare module "next-auth" {
  interface User {
    role?: "doctor" | "patient" | undefined;
    id?: string | undefined;
    region?: string | undefined;
    city?: string | undefined;
    phone?: string | undefined;
    languages?: string[] | undefined;
    dob?: Date | undefined;
    gender?: string | undefined;
    image?: string | undefined | null;
    address_1?: string | undefined | null;
    address_2?: string | undefined | null;
    doctorInfo?: {
      onboarding_level: number;
      current_facility: string | undefined;
      experience: number | undefined;
      specialities: string[] | undefined;
      bio: string | undefined;
      certifications: string[] | undefined;
      media: string[] | undefined;
      rating: number | undefined;
    };
    onboarding_level?: string | undefined;
  }

  interface Session {
    user: {
      role?: "doctor" | "patient" | undefined;
      id?: string | undefined;
      region?: string | undefined;
      city?: string | undefined;
      phone?: string | undefined;
      languages?: string[] | undefined;
      dob?: Date | undefined;
      gender?: string | undefined;
      image?: string | undefined | null;
      address_1?: string | undefined | null;
      address_2?: string | undefined | null;
      onboarding_level?: string | undefined;
      doctorInfo?: {
        onboarding_level: number;
        current_facility: string | undefined;
        experience: number | undefined;
        specialities: string[] | undefined;
        bio: string | undefined;
        certifications: string[] | undefined;
        media: string[] | undefined;
        rating: number | undefined;
      };
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "doctor" | "patient" | undefined;
    id?: string | undefined;
    region?: string | undefined;
    city?: string | undefined;
    phone?: string | undefined;
    languages?: string[] | undefined;
    dob?: Date;
    gender?: string | undefined;
    image?: string | undefined | null;
    address_1?: string | undefined | null;
    address_2?: string | undefined | null;
    doctorInfo?: {
      onboarding_level: number;
      current_facility: string | undefined;
      experience: number | undefined;
      specialities: string[] | undefined;
      bio: string | undefined;
      certifications: string[] | undefined;

      media: string[] | undefined;
      rating: number | undefined;
    };
    onboarding_level?: string | undefined;
  }
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
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
        token.role = user?.role || undefined;
        token.id = user?.id || "";
      }
      if (existingOauthUser) {
        token.id = existingOauthUser._id.toString();
        token.role = existingOauthUser.role || "";
        token.region = existingOauthUser.region || "";
        token.city = existingOauthUser.city || "";
        token.phone = existingOauthUser.phone || "";
        token.languages = existingOauthUser.languages || [];
        token.dob = existingOauthUser.dob || "";
        token.gender = existingOauthUser.gender || "";
        token.image = existingOauthUser.image || "";
        token.onboarding_level =
          existingOauthUser.onboarding_level || undefined;
        token.address_1 = existingOauthUser.address_1 || "";
        token.address_2 = existingOauthUser.address_2 || "";
        token.doctorInfo = existingOauthUser.doctorInfo || undefined;
      }
      if (trigger === "update" && session) {
        const updatedUser = await User.findOne({ email: session?.user.email });

        token = {
          ...token,
          role: session?.user?.role,
          region: updatedUser?.region,
          city: updatedUser?.city,
          phone: updatedUser?.phone,
          languages: updatedUser?.languages,
          gender: updatedUser?.gender,
          dob: updatedUser?.dob,
          image: updatedUser?.image,
          address_1: updatedUser?.address_1,
          address_2: updatedUser?.address_2,
          doctorInfo: updatedUser?.doctorInfo,
          onboarding_level: updatedUser?.onboarding_level,
          user: { ...session?.user },
        };
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
        session.user.phone = token?.phone;
        session.user.languages = token?.languages;
        session.user.dob = token?.dob;
        session.user.gender = token?.gender;
        session.user.image = token?.image;
        session.user.onboarding_level = token?.onboarding_level;
        session.user.doctorInfo = token?.doctorInfo;
        session.user.address_1 = token?.address_1;
        session.user.address_2 = token?.address_2;
      }
      if (trigger === "update") {
        session.user.role = token?.role;
        session.user.id = token?.id || "";
        session.user.region = token?.region;
        session.user.city = token?.city;
        session.user.phone = token?.phone;
        session.user.languages = token?.languages;
        session.user.dob = token?.dob;
        session.user.image = token?.image;
        session.user.gender = token?.gender;
        session.user.onboarding_level = token?.onboarding_level;
        session.user.doctorInfo = token?.doctorInfo;
        session.user.address_1 = token?.address_1;
        session.user.address_2 = token?.address_2;
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
    maxAge: 7 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
});
