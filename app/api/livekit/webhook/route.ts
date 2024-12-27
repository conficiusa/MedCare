import { consultationActor } from "@/lib/stateMachines";
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
    if (event.event === "participant_left") {
      await fetch("/api/ably/broadcast", {
        method: "POST",
        body: JSON.stringify({
          clientId: event.participant?.attributes.user_id, // Target client
          data: {
            participantId: event.participant?.attributes.user_id,
            disconnectReason: event.participant?.disconnectReason,
          },
        }),
        headers: { "Content-Type": "application/json" },
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
