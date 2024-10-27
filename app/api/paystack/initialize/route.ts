// /app/api/paystack/initialize/route.js
import { channel } from "diagnostics_channel";
import https from "https";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
      const paystackReq = https.request(options, (paystackRes) => {
        let data = "";

        paystackRes.on("data", (chunk) => {
          data += chunk;
        });

        paystackRes.on("end", () => {
          const responseData = JSON.parse(data);
          if (responseData.status) {
            resolve(NextResponse.json(responseData, { status: 200 }));
          } else {
            resolve(
              NextResponse.json(
                { error: responseData.message },
                { status: 400 }
              )
            );
          }
        });
      });

      paystackReq.on("error", (error) => {
        console.error(error);
        reject(
          NextResponse.json({ error: "Something went wrong!" }, { status: 500 })
        );
      });

      paystackReq.write(params);
      paystackReq.end();
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
