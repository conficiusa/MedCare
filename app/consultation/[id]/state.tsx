'use client';
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "https://medcare-hub.vercel.app"; // Replace with your server URL

const State = ({ session }: { session: Session }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO client with user ID
    const socket = io(SOCKET_SERVER_URL, {
      query: { userId: session.user.id },
    });

    // Listen for the 'state_update' event
    socket.on("state_update", (newState) => {
      console.log("State update received:", newState);
      setState(newState);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [session]);

  return (
    <div>
      <h1>State Update</h1>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

export default State;
