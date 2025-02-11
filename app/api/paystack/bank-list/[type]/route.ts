import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongoose";
import Banks from "@/models/Banks";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req, res): Promise<NextResponse> {
  try {
    if (!req.auth) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }
    const { type } = res?.params as { type: string };
    connectToDatabase();
    const data = await Banks.find({ type });
    const banks = data.map((bank) => {
      return {
        id: bank.toString(),
        ...bank.toObject(),
      };
    });
    return NextResponse.json({ success: true, data: banks }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
});
