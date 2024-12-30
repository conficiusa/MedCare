"use client";
import { useEffect, useState } from "react";
import { consultationMachine } from "@/lib/stateMachines";
import { useActorRef, useSelector } from "@xstate/react";
import { RealtimeChannel, RealtimeClient, Realtime, Message } from "ably";
import { useAbly, usePresence, usePresenceListener } from "ably/react";

interface event {
  type?: string;
  disconnectReason?: number;
}
export default function ParticipantState({ clientId }: { clientId: string }) {
  const consultRef = useActorRef(consultationMachine);
  const state = useSelector(consultRef, (state) => state.value);
  const ably = useAbly();
  usePresence(`consultation-${clientId}`);
  const { presenceData } = usePresenceListener(`consultation-${clientId}`);

  const presenceList = presenceData.map((member, index) => {
    const isItMe = member.clientId === ably.auth.clientId ? "(me)" : "";

    return (
      <li key={index}>
        <span>{member.clientId}</span>
        <span>{isItMe}</span>
      </li>
    );
  });

  return (
    <div>
      <ul>{presenceList}</ul>
      {JSON.stringify(state)}
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
