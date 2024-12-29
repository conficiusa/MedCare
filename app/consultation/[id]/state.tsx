"use client";
import { useState } from "react";
import { consultationMachine } from "@/lib/stateMachines";
import { useChannel } from "ably/react";
import { useActorRef, useSelector } from "@xstate/react";

interface event {
  type?: string;
  disconnectReason?: number;
}
export default function ParticipantState({ clientId }: { clientId: string }) {
  const [event, setEvent] = useState<event>({});

  const consultRef = useActorRef(consultationMachine);
  const state = useSelector(consultRef, (state) => state.value);
  useChannel(`consultation-${clientId}`, (message) => {
    setEvent(message.data);
  });
  console.log(event);
  // Render UI based on the current state
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
