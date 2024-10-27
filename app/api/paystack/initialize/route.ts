import { NextRequest, NextResponse } from "next/server";
import https from "https";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email, amount, channels, metadata } = await request.json();
    const params = JSON.stringify({
      email,
      amount: amount * 100,
      channels,
      metadata,
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
