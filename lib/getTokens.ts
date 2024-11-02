"use server";
import { AccessToken } from "livekit-server-sdk";

export const generateRoomToken = (
  identity: string,
  roomName: string,
  apiKey: string,
  apiSecret: string
) => {
  const token = new AccessToken(apiKey, apiSecret, {
    identity,
    name: roomName,
  });
  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });
  return token.toJwt();
};
