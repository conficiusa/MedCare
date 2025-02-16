import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(req.url);
    const account_number = searchParams.get("account_number");
    const bank_code = searchParams.get("bank_code");

    if (!account_number || !bank_code) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    if (!/^\d+$/.test(account_number)) {
      return NextResponse.json(
        { error: "Invalid account_number, must be numeric" },
        { status: 400 }
      );
    }
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    };

    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      options
    );
    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        data,
        status: "success",
      },
      { status: 200, statusText: "OK" }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred",
        error: error.message,
        status: "fail",
        statusCode: 500,
      },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
});
