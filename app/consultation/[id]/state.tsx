"use client";
import { useState, useEffect } from "react";
import * as Ably from "ably";
import { useActor, useMachine } from "@xstate/react";
import { consultationMachine } from "@/lib/stateMachines";

export default function ParticipantState({ clientId }: { clientId: string }) {
  // Initialize the state machine actor
  const [state, send] = useMachine(consultationMachine);

  // Connect to Ably
  useEffect(() => {
    const client = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY!,
      clientId: clientId,
    });

    const channel = client.channels.get(`state-updates-${clientId}`);

    // Listen for events and trigger state machine transitions
    channel.subscribe("state-update", (message) => {
      const { event } = message.data;

      if (event === "participant.left") {
        send({ type: "PARTICIPANT_LEFT", disconnectReason: 1 }); // Send event to XState
      }
    });

    return () => {
      channel.unsubscribe();
      client.close();
    };
  }, [clientId, send]);

  // Render UI based on the current state
  return <div>{JSON.stringify(state.output)}</div>;
}
