import NextAuth from "next-auth";
import { authConfig } from "@/authconfig";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
