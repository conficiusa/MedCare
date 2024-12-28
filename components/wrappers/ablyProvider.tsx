"use client";
import React, { ReactNode } from "react";
import { AblyProvider, ChannelProvider } from "ably/react";
import { Realtime } from "ably";

const AblyRealtimeProvider = ({
  children,
  clientId,
}: {
  children: ReactNode;
  clientId: string;
}) => {
  const client = new Realtime({
    key: process.env.NEXT_PUBLIC_ABLY_KEY as string,
    autoConnect: typeof window !== "undefined",
    clientId: clientId,
  });
  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={`consultation-${clientId}`}>
        {children}
      </ChannelProvider>
    </AblyProvider>
  );
};

export default AblyRealtimeProvider;
