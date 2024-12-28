import { WebhookReceiver } from "livekit-server-sdk";
import { NextResponse } from "next/server";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY as string,
  process.env.LIVEKIT_API_SECRET as string
);

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const event = await receiver.receive(await req.text(), authHeader);
    console.log("event", event);
    const ablyPublishUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/ably/publish`;
    if (event.event === "participant_left") {
      await fetch(ablyPublishUrl, {
        method: "POST",
        body: JSON.stringify({
          participantId: event.participant?.attributes.user_id,
          disconnectReason: event.participant?.disconnectReason,
          event: "participant_left",
        }),
        headers: { "Content-Type": "application/json" },
      }).catch((error) => {
        console.error("Failed to publish to Ably:", error.message);
      });
    }
    return NextResponse.json(
      { message: "Webhook received", event },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handling failed", details: error.message },
      { status: 500 }
    );
  }
}
