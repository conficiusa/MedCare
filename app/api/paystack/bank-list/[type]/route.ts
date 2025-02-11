import { auth } from "@/auth";
import {  NextResponse } from "next/server";

export const GET = auth(async function GET(req, res): Promise<NextResponse> {

  try {
    // if (!req.auth) {
    //   return NextResponse.json(
    //     { error: "You are not authenticated" },
    //     { status: 401 }
    //   );
    // }
    const { type } = res?.params as { type: string };
    const country = "ghana";

    const url = new URL("https://api.paystack.co/bank");
    url.searchParams.append("country", country);
    // url.searchParams.append("type", type);

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url.toString(), options);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
});
