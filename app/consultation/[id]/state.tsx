"use client";
import { useEffect, useState } from "react";
import { consultationMachine } from "@/lib/stateMachines";
import { useActorRef, useSelector } from "@xstate/react";
import ConsultationStatusDialog from "@/components/blocks/askIfOver";
import { useRouter } from "next/navigation";

export default function ParticipantState({
  appointmentId,
  state,
}: {
  appointmentId: string;
  state: string;
}) {
  const consultRef = useActorRef(consultationMachine);
  const router = useRouter();

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
