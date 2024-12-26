import { consultationActor } from "@/lib/stateMachines";
import { WebhookReceiver } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { Server } from "socket.io";

const io = new Server(); // Initialize your Socket.IO server
const userSocketMap = new Map<string, string>(); // Map to store user ID and socket ID
const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY as string,
  process.env.LIVEKIT_API_SECRET as string
);
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    userSocketMap.set(userId, socket.id);
  }

  socket.on("disconnect", () => {
    userSocketMap.delete(userId);
  });
});

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const event = await receiver.receive(await req.text(), authHeader);

    if (event.event === "participant_left") {
      // Update state machine based on the event
      consultationActor.send({
        type: "PARTICIPANT_LEFT",
        disconnectReason: event.participant?.disconnectReason as number,
      });

      // Get the updated state
      const state = consultationActor.getSnapshot().value;

      // Emit the updated state to the specific user via WebSocket
      const userId = event.participant?.attributes?.user_id as string;
      const socketId = userSocketMap.get(userId);
      if (io && socketId) {
        io.to(socketId).emit("state_update", state);
      }
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
