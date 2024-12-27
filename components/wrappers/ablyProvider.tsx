import * as Ably from "ably";

import React, { ReactNode } from "react";
import { AblyProvider } from "ably/react";

const AblyRealtimeProvider = ({
  children,
  clientId,
}: {
  children: ReactNode;
  clientId: string;
}) => {
  const client = new Ably.Realtime({
    key: process.env.NEXT_PUBLIC_ABLY_KEY,
    clientId,
  });

  return <AblyProvider client={client}>{children}</AblyProvider>;
};

export default AblyRealtimeProvider;
