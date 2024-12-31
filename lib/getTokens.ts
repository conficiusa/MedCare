"use server";
import { auth } from "@/auth";
import Appointment from "@/models/Appointment";
import {
  AccessToken,
  CreateOptions,
  RoomServiceClient,
} from "livekit-server-sdk";
import { redirect } from "next/navigation";
import { ReturnType } from "@/lib/definitions";
import { differenceInSeconds } from "date-fns";
import connectToDatabase from "./mongoose";

const apiSecret = process.env.LIVEKIT_API_SECRET;
const apiKey = process.env.LIVEKIT_API_KEY;
const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
const roomService = new RoomServiceClient(
  wsUrl as string,
  apiKey as string,
  apiSecret as string
);

/**
 * Generates a room token for a given identity and appointment ID.
 *
 * @param {string} identity - The identity of the user requesting the token.
 * @param {string} appointmentId - The ID of the appointment for which the token is being generated.
 * @returns {Promise<ReturnType>} - A promise that resolves to an object containing the token or an error message.
 *
 * @throws {Error} - Throws an error if there is an issue generating the token.
 *
 * The function performs the following steps:
 * 1. Authenticates the session.
 * 2. Checks if the session is valid; if not, redirects to the sign-in page.
 * 3. Validates the appointment ID.
 * 4. Checks if the identity matches the session user ID.
 * 5. Connects to the database and retrieves the appointment by ID.
 * 6. Validates the appointment and checks if it has expired.
 * 7. Checks if the session user is authorized to access the appointment.
 * 8. Creates a room with specific options.
 * 9. Saves the room details to the appointment.
 * 10. Generates an access token with the appropriate role (doctor or patient).
 * 11. Returns the generated token or an error message.
 */
export const generateRoomToken = async (
  identity: string,
  appointmentId: string
): Promise<ReturnType> => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  if (!appointmentId) {
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
    await connectToDatabase();
    const confirmAppointment = await Appointment.findById(appointmentId);
    if (!confirmAppointment) {
      return {
        error: "Failed to load appointment",
        message: "Appointment not found",
        type: "Not Found",
        status: "fail",
        statusCode: 404,
      };
    }
    if (confirmAppointment?.status === "completed") {
      return {
        error: "This consultation session has been completed",
        message: "This consultation session has been completed",
        type: "Stale",
        status: "fail",
        statusCode: 400,
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
      session.user?.id !== appointment?.doctor?.doctorId &&
      session?.user?.id !== appointment?.patient?.patientId
    ) {
      return {
        error: "Unauthorized",
        message: "Unauthorized",
        type: "Unauthorized",
        status: "fail",
        statusCode: 401,
      };
    }
    const opts: CreateOptions = {
      name: appointmentId,
      emptyTimeout: 2 * 60, // 2 minutes
      maxParticipants: 2,
      metadata: appointmentId,
      departureTimeout: 2 * 60, // 2 minutes
    };
    const room = await roomService.createRoom(opts);

    if (!room) {
      return {
        error: "Failed to create room",
        status: "fail",
        message: "Failed to create room. check your connection and try again",
        statusCode: 500,
        type: "Network error",
      };
    }
    confirmAppointment.room = {
      name: room.name,
      sid: room?.sid,
      maxParticipants: room?.maxParticipants,
    };
    await confirmAppointment.save();
    const token = new AccessToken(apiKey, apiSecret, {
      identity,
      name: room?.name,
      ttl: "1h",
      attributes: {
        role:
          session.user?.id === appointment?.doctor?.doctorId
            ? "doctor"
            : "patient",
        appointmentId,
        user_id: session.user?.id,
      },
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
