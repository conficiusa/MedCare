import { Rest } from "ably";

// Webhook listener for POST requests
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { event, participantId, disconnectReason } = body;

    if (event === "participant_left") {
      // Publish state-update event to Ably
      await BroadcastEvent(participantId, disconnectReason);
    }

    // Return success response
    return Response.json({
      success: true,
      message: "state-update event published",
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return Response.json(
      { success: false, error: "Failed to process webhook" },
      { status: 500 }
    );
  }
};

const BroadcastEvent = async (
  participantId: string,
  disconnectReason: number
) => {
  const client = new Rest(process.env.ABLY_KEY ?? "");
  const channel = client.channels.get(`consultation-${participantId}`);
  await channel.publish("state-update", {
    event: "PARTICIPANT_LEFT",
    disconnectReason,
  });
};
