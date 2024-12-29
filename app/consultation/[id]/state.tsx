"use client";
import { useEffect, useState } from "react";
import { consultationMachine } from "@/lib/stateMachines";
import { useActorRef, useSelector } from "@xstate/react";
import { RealtimeChannel, RealtimeClient, Realtime, Message } from "ably";

interface event {
  type?: string;
  disconnectReason?: number;
}
export default function ParticipantState({ clientId }: { clientId: string }) {
  const [event, setEvent] = useState<event>({});
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const consultRef = useActorRef(consultationMachine);
  const state = useSelector(consultRef, (state) => state.value);

  useEffect(() => {
    let ablyClient: RealtimeClient;

    const init = async () => {
      ablyClient = new Realtime({
        authUrl: `/api/ably/auth/${clientId}`,
        clientId,
      });
      await ablyClient.connection.once("connected");
      const chatChannel = ablyClient.channels.get(`consultation-${clientId}`);
      setChannel(chatChannel);
      await chatChannel.subscribe("state-update", (message: Message) => {
        console.log("message", message);
      });
    };
    init();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
      if (ablyClient) {
        ablyClient.close();
      }
    };
  }, []);

  console.log(
    channel?.subscribe("state-update", (message: Message) => {
      console.log("message", message);
    })
  );
  return (
    <div>
      {JSON.stringify(state)}{" "}
      <button
        onClick={async () =>
          await fetch("/api/ably/publish", {
            method: "POST",
            body: JSON.stringify({
              participantId: clientId,
              disconnectReason: 1,
              event: "participant_left",
            }),
            headers: { "Content-Type": "application/json" },
          }).catch((error) => {
            console.error("Failed to publish to Ably:", error.message);
          })
        }
      >
        triger
      </button>
    </div>
  );
}
