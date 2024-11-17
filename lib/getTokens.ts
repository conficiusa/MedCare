"use server";
import { auth } from "@/auth";
import Appointment from "@/models/Appointment";
import { AccessToken } from "livekit-server-sdk";
import { redirect } from "next/navigation";
import { ReturnType } from "@/lib/definitions";
import { differenceInSeconds } from "date-fns";
import connectToDatabase from "./mongoose";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

export const generateRoomToken = async (
  identity: string,
  room: { sid: string; maxParticipants: number; name: string }
): Promise<ReturnType> => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  if (!room?.sid || !room?.name) {
    return {
      error: "Missing Fields",
      message: "Missing room configuration",
      statusCode: 400,
      type: "Bad Request",
      status: "fail",
    };
  }
  try {
    if (session.user?.id !== identity) {
      return {
        error: "Unauthorized",
        message: "Invalid Identity token",
        type: "Unauthorized",
        status: "fail",
        statusCode: 401,
      };
    }
    connectToDatabase();
    const confirmAppointment = await Appointment.findOne({
      "room.sid": room?.sid,
    });

    if (!confirmAppointment) {
      return {
        error: "Appointment not found",
        message: "Appointment not found",
        type: "Not Found",
        status: "fail",
        statusCode: 404,
      };
    }
    const appointment = confirmAppointment?.toObject();

    const ttl = differenceInSeconds(
      new Date(appointment?.timeSlot?.endTime),
      new Date()
    );

    if (ttl <= 0) {
      return {
        error: "Expired",
        message: "Appointment has expired",
        type: "Expired",
        status: "fail",
        statusCode: 400,
      };
    }

    if (
      appointment?.room?.maxParticipants !== room?.maxParticipants ||
      appointment?.room?.name !== room?.name ||
      appointment?.room?.sid !== room?.sid
    ) {
      return {
        error: "Invalid room",
        message: "Invalid room",
        type: "Invalid Room",
        status: "fail",
        statusCode: 400,
      };
    }
    if (session.user?.role === "doctor") {
      if (session.user?.id !== appointment?.doctor?.doctorId) {
        return {
          error: "Unauthorized",
          message: "Unauthorized",
          type: "Unauthorized",
          status: "fail",
          statusCode: 401,
        };
      }
      const token = new AccessToken(apiKey, apiSecret, {
        identity,
        name: room?.name,
      });
      token.addGrant({
        roomJoin: true,
        room: room?.name,
        canPublish: true,
        canSubscribe: true,
      });
      return {
        data: { token: await token.toJwt() },
        message: "Token generated",
        status: "success",
        statusCode: 200,
      };
    } else {
      if (session.user?.id !== appointment?.patient?.patientId) {
        return {
          error: "Unauthorized",
          message: "Unauthorized",
          type: "Unauthorized",
          status: "fail",
          statusCode: 401,
        };
      }
      const token = new AccessToken(apiKey, apiSecret, {
        identity,
        name: session?.user?.name?.split(" ")[0],
        ttl,
      });
      token.addGrant({
        roomJoin: true,
        room: room?.name,
        canPublish: true,
        canSubscribe: true,
      });
      return {
        data: { token: await token.toJwt() },
        message: "Token generated",
        status: "success",
        statusCode: 200,
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      error: error?.message,
      message: "Error generating token",
      type: "Server Error",
      status: "fail",
      statusCode: 500,
    };
  }
};
