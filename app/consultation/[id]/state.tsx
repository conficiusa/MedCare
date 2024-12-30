"use client";
import { useState } from "react";
import { consultationMachine } from "@/lib/stateMachines";
import { useActorRef, useSelector } from "@xstate/react";
import { useChannel } from "ably/react";

interface event {
  type?: string;
  disconnectReason?: number;
}
export default function ParticipantState({ clientId }: { clientId: string }) {
  const consultRef = useActorRef(consultationMachine);
  const state = useSelector(consultRef, (state) => state.value);
  const [event, updateEvent] = useState<event>({});
  useChannel(`consultation-${clientId}`, (event) => {
    updateEvent(event?.data);
    consultRef.send({
      type: "PARTICIPANT_LEFT",
      disconnectReason: event?.data?.disconnectReason,
    });
  });

  console.log("event", event);

  return (
    <div>
      {state}
      <button
        onClick={async () =>
          await fetch("/api/ably/publish", {
            method: "POST",
            body: JSON.stringify({
              participantId: clientId,
              disconnectReason: 3,
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
