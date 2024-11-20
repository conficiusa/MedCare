import { WebhookReceiver } from "livekit-server-sdk";
import { NextResponse } from "next/server";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY as string,
  process.env.LIVEKIT_API_SECRET as string
);

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const event = await receiver.receive(
      await req.text(),
      req.headers.get("authorization") as string
    );
    return NextResponse.json(
      { message: "Webhook received", event },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Webhook handling failed", details: error.message },
      { status: 400 }
    );
  }
}
