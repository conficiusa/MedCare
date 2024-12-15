"use client";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useParticipants,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";

import { useEffect, useState } from "react";
import { Track } from "livekit-client";
import { useRouter } from "next/navigation";
import { generateRoomToken } from "@/lib/getTokens";
import { Session } from "next-auth";
import { ErrorReturn } from "@/lib/definitions";
import Link from "next/link";

export default function VideoCall({
  appointmentId,
  session,
}: {
  appointmentId: string;
  session: Session;
}) {
  const [token, setToken] = useState("");
  const [error, setError] = useState<ErrorReturn | undefined>(undefined);
  const router = useRouter();

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
      <div className="flex justify-center items-center h-[100dvh] flex-col max:sm:px-4">
        <h1>{error?.message}</h1>
        <p className="text-sm">
          If you have a valid appointment yet the error persists, kindly{" "}
          <Link className="text-primary" href={"/contact"}>
            Contact us
          </Link>
        </p>
      </div>
    );
  }
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: "100dvh" }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  const participant = useParticipants();
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
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
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
