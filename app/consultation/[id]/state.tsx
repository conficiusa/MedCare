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

  const { channel } = useChannel(`consultation-${clientId}`, (message) => {
    setEvent(message.data);
  });
  console.log(event);
  console.log(channel);
  // Render UI based on the current state
  return <div>{JSON.stringify(state)}</div>;
}
