import { NextRequest, NextResponse } from "next/server";
import https from "https";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { email, amount, channels, metadata } = await request.json();
    const params = JSON.stringify({
      email,
      amount: amount * 100,
      channels,
      metadata,
      reference: uuidv4(),
      first_name: session?.user?.name?.split(" ")[0],
      last_name: session?.user?.name?.split(" ")[1],
      phone: session?.user?.phone,
      key: process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY as string,
    });

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(NextResponse.json(JSON.parse(data)));
          } else {
            resolve(
              NextResponse.json({ error: "Failed to initialize transaction" })
            );
          }
        });
      });

      req.on("error", (e) => {
        resolve(NextResponse.json({ error: e.message }));
      });

      req.write(params);
      req.end();
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}
