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
  const router = useRouter();

  useChannel(`consultation-${clientId}`, (event) => {
    consultRef.send({
      type: "PARTICIPANT_LEFT",
      disconnectReason: event?.data?.disconnectReason,
    });
  });

  useEffect(() => {
    if (state === "showDialogs") {
      router.refresh();
      router.push(`/consultation/review/${appointmentId}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, appointmentId]);
  return (
    <div>
      {state === "askIfOver" && (
        <ConsultationStatusDialog
          consultRefActor={consultRef}
          appointmentId={appointmentId}
        />
      )}
    </div>
  );
}
