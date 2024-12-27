import { NextResponse } from "next/server";
import Ably from "ably";

const ably = new Ably.Realtime(process.env.ABLY_KEY as string);

export async function POST(req: Request) {
  const body = await req.json();

  const { event, participantId, disconnectReason } = body;

  try {
    const channel = ably.channels.get(`state-updates-${participantId}`);
    // Send specific events based on webhook payload
    if (event === "participant.left") {
      await channel.publish("state-update", {
        event: "participant.left",
        data: { disconnectReason },
      });
    } else if (event === "consultation.over") {
      await channel.publish("state-update", {
        event: "consultation.over",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Ably Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
