"use client";
import { useEffect, useState } from "react";
import { consultationMachine } from "@/lib/stateMachines";
import { useActorRef, useSelector } from "@xstate/react";
import ConsultationStatusDialog from "@/components/blocks/askIfOver";
import { useRouter } from "next/navigation";

export default function ParticipantState({
  appointmentId,
  state,
  isDoctor = false,
}: {
  appointmentId: string;
  state: string;
  isDoctor?: boolean;
}) {
  const consultRef = useActorRef(consultationMachine);
  const router = useRouter();

  useEffect(() => {
    if (state === "showDialogs") {
      router.refresh();
      if (isDoctor) {
        router.push(`/consultation/report/${appointmentId}`);
      } else {
        router.push(`/consultation/review/${appointmentId}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, appointmentId, isDoctor]);
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
