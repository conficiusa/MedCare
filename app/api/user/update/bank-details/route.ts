import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import BankToken from "@/models/BankToken";
import { BankTokenType } from "@/lib/definitions";
import { sendEmailAction } from "@/lib/actions";
import { bankUpdateEmail } from "@/lib/emails";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export const GET = auth(async function GET(req, res) {
  if (!req.auth) {
    return NextResponse.json(
      { error: "You are not authenticated" },
      { status: 401 }
    );
  }
  const userEmail = req.auth.user.email;
  if (!userEmail) {
    return NextResponse.json({ error: "No email found" }, { status: 400 });
  }
  const token = crypto.randomBytes(3).toString("hex");
  const tokenExpiration = new Date(Date.now() + 10 * 60 * 1000);
  const doc: Omit<BankTokenType, "createdAt"> = {
    email: userEmail,
    token,
    expiresAt: tokenExpiration,
    used: false,
  };
  try {
    await connectToDatabase();
    // Invalidate all existing tokens for this user
    await BankToken.updateMany({ email: userEmail }, { $set: { used: true } });
    // Create new token
    await BankToken.create(doc);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "failed to send token",
      },
      { status: 500 }
    );
  }

  await sendEmailAction(
    "email",
    userEmail,
    "Bank details update requests",
    bankUpdateEmail(token)
  );
  return NextResponse.json(
    {
      message: "Enter the token sent to your email.",
    },
    { status: 200 }
  );
});

export const POST = auth(async function POST(req, res) {
  if (!req.auth) {
    return NextResponse.json(
      { error: "You are not authenticated" },
      { status: 401 }
    );
  }
  const userEmail = req.auth.user.email;
  if (!userEmail) {
    return NextResponse.json({ error: "No email found" }, { status: 400 });
  }
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }
  try {
    await connectToDatabase();
    const tokens = await BankToken.find({
      email: userEmail,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    let validToken = null;
    for (const dbToken of tokens) {
      const isMatch = await bcrypt.compare(token, dbToken.token);
      if (isMatch) {
        validToken = dbToken;
        break;
      }
    }
    if (!validToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }
    validToken.used = true;
    await validToken.save();
    cookies().set("bankToken", validToken, {
      maxAge: 60 * 10,
      expires: validToken.expiresAt,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    });
    return NextResponse.json(
      { message: "Token verified successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "failed to verify token" },
      { status: 500 }
    );
  }
});
