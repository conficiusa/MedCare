import { auth } from "@/auth";
import { Realtime } from "ably";

// Webhook listener for POST requests
export const POST = async (req: Request) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }
    // Parse incoming webhook event
    const body = await req.json();

    console.log("body:", body);
    const { event, participantId, disconnectReason } = body;

    // Initialize Ably client
    const client = new Realtime({
      key: process.env.ABLY_KEY,
      clientId: session.user.id,
    });

    // Publish message to the user's unique channel
    const channel = client.channels.get(`consultation-${participantId}`);
    if (event === "participant_left") {
      await channel.publish("state-update", {
        event: "participant.left",
        disconnectReason,
      });
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
