import { NextResponse } from "next/server";
import Banks from "@/models/Banks";
import connectToDatabase from "@/lib/mongoose";
import { Bank } from "@/lib/definitions";

export async function GET(request: any): Promise<Response> {
  try {
    const authHeader = request?.headers?.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    await connectToDatabase();
    const country = "ghana";
    const url = new URL("https://api.paystack.co/bank");
    url.searchParams.append("country", country);

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url.toString(), options);
    const data = await response.json();

    // Ensure the expected data exists
    if (data.status && Array.isArray(data.data)) {
      const banksData = data.data;

      const bulkOps = banksData.map((bank: Bank) => ({
        updateOne: {
          filter: { code: bank.code },
          update: { $set: bank },
          upsert: true,
        },
      }));
      await Banks.bulkWrite(bulkOps);
    }
    return NextResponse.json({ success: true, message: "Banks fetched" });
  } catch (error: any) {
    console.error("Error fetching or saving banks:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}
