// app/api/verify/[reference]/route.js
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { reference: string } }
): Promise<NextResponse> {
  const session = auth();

  if (!session) {
    return NextResponse.json("User session has expired");
  }
  const { reference } = params; // Dynamic route parameter for reference
  const url = new URL(request.url);
  const rate = url.searchParams.get("rate"); // Query parameter for rate

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Store your secret key in an environment variable
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Verification failed" },
      { status: response.status }
    );
  }

  const data = await response.json();
  if (rate && data.data?.amount !== Number(rate) * 100) {
    return NextResponse.json({ error: "Rate mismatch" }, { status: 400 });
  }

  if (data?.data?.status === "success") {
    return NextResponse.json({ status: "success", data, statusCode: 200 });
  }
  return NextResponse.json({ status: "failed", data, statusCode: 402 });
}
