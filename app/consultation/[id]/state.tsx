"use client";
import { useEffect, useState } from "react";
import { consultationMachine } from "@/lib/stateMachines";
import { useActorRef, useSelector } from "@xstate/react";
import { useChannel } from "ably/react";
import ConsultationStatusDialog from "@/components/blocks/askIfOver";
import { useRouter } from "next/navigation";

interface event {
  type?: string;
  disconnectReason?: number;
}
export default function ParticipantState({
  clientId,
  appointmentId,
}: {
  clientId: string;
  appointmentId: string;
}) {
  const consultRef = useActorRef(consultationMachine);
  const state = useSelector(consultRef, (state) => state.value);
  const [event, updateEvent] = useState<event>({});
  const router = useRouter();

  useChannel(`consultation-${clientId}`, (event) => {
    updateEvent(event?.data);
    consultRef.send({
      type: "PARTICIPANT_LEFT",
      disconnectReason: event?.data?.disconnectReason,
    });
  });

  console.log("event", event);
  useEffect(() => {
    if (state === "showDialogs") {
      router.push(`${appointmentId}/review`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, appointmentId]);
  return (
    <div>
      {state}
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
      {state === "askIfOver" && (
        <ConsultationStatusDialog consultRefActor={consultRef} />
      )}
    </div>
  );
}
