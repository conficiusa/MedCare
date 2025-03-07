"use client";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";

import { useEffect, useState } from "react";
import { Track } from "livekit-client";
import { useRouter } from "next/navigation";
import { generateRoomToken } from "@/lib/getTokens";
import { Session } from "next-auth";
import { Appointment, ErrorReturn } from "@/lib/definitions";
import Link from "next/link";
import { useActorRef, useSelector } from "@xstate/react";
import { consultationMachine } from "@/lib/stateMachines";
import ParticipantState from "./state";

export default function VideoCall({
  appointmentId,
  session,
  appointment,
}: {
  appointmentId: string;
  session: Session;
  appointment: Appointment;
}) {
  const [token, setToken] = useState("");
  const [error, setError] = useState<ErrorReturn | undefined>(undefined);
  const router = useRouter();
  const consultRef = useActorRef(consultationMachine);
  const state = useSelector(consultRef, (state) => state.value);
  const isDoctor = session?.user?.id === appointment?.doctor.doctorId;

  console.log(state);

  useEffect(() => {
    (async () => {
      try {
        const data = await generateRoomToken(
          session?.user?.id as string,
          appointmentId
        );
        if ("data" in data) {
          setToken(data?.data?.token);
        } else {
          setToken("");
          setError(data);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [router, session, appointmentId]);

  if (!token && !error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Authenticating request...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[100dvh] flex-col max-sm:px-4">
        <h1>{error?.message}</h1>
        <p className="text-sm text-center text-muted-foreground">
          If you have a valid appointment yet the error persists, kindly{" "}
          <Link className="text-primary" href={"/contact"}>
            Contact us
          </Link>
        </p>
      </div>
    );
  }
  return (
    <>
      <ParticipantState
        appointmentId={appointmentId}
        state={state}
        isDoctor={isDoctor}
      />
      <LiveKitRoom
        onDisconnected={(reason) => {
          consultRef.send({
            type: "PARTICIPANT_LEFT",
            disconnectReason: 1,
          });
        }}
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        style={{ height: "100dvh" }}
      >
        <MyVideoConference />
        <RoomAudioRenderer />

        <ControlBar />
      </LiveKitRoom>
    </>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height) - 6rem)" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
