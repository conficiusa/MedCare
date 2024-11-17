"use server";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { IAppointmentSchema, SignInSchema } from "@/lib/schema";
import connectToDatabase from "@/lib/mongoose";
import { z } from "zod";
import {
  Appointment as AppointmentType,
  ErrorReturn,
  ITimeSlot,
  ReturnType,
  SuccessReturn,
} from "@/lib//definitions";
import { MongooseError } from "mongoose";
import User from "@/models/User";
import { isRedirectError } from "next/dist/client/components/redirect";
import Availability from "@/models/Availability";
import Appointment from "@/models/Appointment";

export async function emailAuth(
  email: z.output<typeof SignInSchema>,
  callbackUrl: string | null
): Promise<ReturnType> {
  try {
    //connect to database
    await connectToDatabase();

    //validate the email
    const parsed = SignInSchema.safeParse(email);
    if (!parsed.success) {
      return {
        error: parsed.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Sign In.",
        type: "ValidationError",
        status: "fail",
        statusCode: 400,
      } as ErrorReturn;
    }

    //sign in the user
    await signIn("nodemailer", {
      ...parsed.data,
      callbackUrl,
    });

    return {
      message: "Email sent",
      status: "success",
      statusCode: 200,
      data: {},
    } as SuccessReturn;
  } catch (error: any) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid Credentials",
            type: "Credentials Error",
            status: "fail",
            statusCode: 401,
            error: error,
          };
        case "CallbackRouteError":
          return {
            message:
              "This account was likely created with a different provider.",
            type: "Callback Error",
            status: "fail",
            statusCode: 400,
            error: error,
          };
        default:
          return {
            message: "An unexpected error occurred.",
            type: "Unexpected Error",
            status: "fail",
            statusCode: 500,
            error: error,
          };
      }
    }
    return {
      message: "An unexpected error occurred.",
      type: "Unexpected Error",
      status: "fail",
      statusCode: 500,
      error: error,
    };
  }
}

export const googleSignIn = async (
  redirect: string | null
): Promise<ReturnType> => {
  try {
    await signIn("google", {
      callbackUrl: redirect ?? "/find-a-doctor",
      redirectTo: redirect ?? "/find-a-doctor",
    });

    return {
      message: "Redirecting to Google",
      status: "success",
      statusCode: 200,
      data: {},
    } as SuccessReturn;
  } catch (error: any) {
    console.error(error);

    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid Credentials",
            type: "Credentials Error",
            status: "fail",
            statusCode: 401,
            error: error,
          };
        case "CallbackRouteError":
          return {
            message:
              "This account was likely created with a different provider.",
            type: "Callback Error",
            status: "fail",
            statusCode: 400,
            error: error,
          };
        default:
          return {
            message: "An unexpected error occurred.",
            type: "Unexpected Error",
            status: "fail",
            statusCode: 500,
            error: error,
          };
      }
    }
    return {
      message: "An unexpected error occurred.",
      type: "Unexpected Error",
      status: "fail",
      statusCode: 500,
      error: error,
    };
  }
};

export const CreateAppointment = async (
  appointmentData: Partial<AppointmentType>
): Promise<ReturnType> => {
  // Check if the user is authenticated
  const authsession = await auth();
  if (!authsession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to create an appointment",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }
  try {
    //connect to the  database
    await connectToDatabase();

    // Find the doctor
    const doctor = await User.findById(
      appointmentData?.doctor?.doctorId
    ).select(["name", "image"]);

    // Check if the doctor exists and handle the error
    if (!doctor) {
      return {
        error: "Doctor not found",
        message: "Your selected doctor could not be found",
        status: "fail",
        statusCode: 404,
        type: "Not Found",
      } as ErrorReturn;
    }

    //compiling the complete data
    const CompleteData = {
      ...appointmentData,
      doctor: {
        name: doctor?.name,
        image: doctor?.image,
        doctorId: appointmentData?.doctor?.doctorId,
      },
      patient: {
        image: authsession?.user?.image,
        name: authsession?.user?.name,
        patientId: authsession?.user?.id,
      },

      // Set the appointment as unpaid
      paid: false,
    };

    //validate the data
    const parsedData = IAppointmentSchema.safeParse(CompleteData);

    // Check if the data is valid and handle the error
    if (!parsedData.success) {
      console.error(parsedData.error.flatten().fieldErrors);
      return {
        error: parsedData.error.flatten().fieldErrors,
        message: "Invalid appointment data",
        status: "fail",
        statusCode: 400,
        type: "ValidationError",
      } as ErrorReturn;
    }

    //save the appointment
    const appointment = new Appointment(parsedData.data);
    await appointment.save();

    // Check if the appointment was saved and handle the error
    if (!appointment) {
      return {
        error: "Appointment not saved",
        message: "We could not create your appointment",
        status: "fail",
        statusCode: 500,
        type: "Server Error",
      } as ErrorReturn;
    }

    // Mark the timeslot as booked
    const timeSlotBooking = await markTimeSlotAsBooked(
      appointmentData?.timeSlot?.slotId as string,
      authsession.user.id as string
    );

    // This will be handled by the system admin when the get this log on the server since user cant do anything about that
    if (timeSlotBooking?.status === "fail") {
      console.error("Appoinment created but slot still available");
    }

    // Return the appointment
    return {
      data: appointment.toObject() as Partial<AppointmentType>,
      message: "Appointment created successfully",
      status: "success",
      statusCode: 200,
    } as SuccessReturn;

    // Handle any errors
  } catch (error: MongooseError | any) {
    console.error(error);
    return {
      error: error,
      message: "An unexpected error occurred",
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    } as ErrorReturn;
  }
};

const markTimeSlotAsBooked = async (
  slotId: string,
  patientId: string
): Promise<ReturnType> => {
  try {
    // Find the availability document containing this slotId
    const result = await Availability.findOneAndUpdate(
      { "timeSlots.slotId": slotId }, // Find the availability document containing this slotId
      {
        $set: {
          "timeSlots.$.isBooked": true,
          "timeSlots.$.patientId": patientId, // Set the patientId for the matched slot
        },
      }, // Set isBooked to true for the matched slot
      { new: true }
    );

    //check if time slot was found and handle errors appropriately
    if (!result) {
      return {
        error: "Time slot not found",
        message:
          " Your selected timeslot is no longer available please select another",
        status: "fail",
        statusCode: 404,
        type: "Not Found",
      } as ErrorReturn;
    }

    //return sucess result
    return {
      data: result?.timeSlots.find((slot: ITimeSlot) => slot.slotId === slotId),
      message: "Time slot marked as booked",
      status: "success",
      statusCode: 200,
    } as SuccessReturn;
  } catch (error) {
    console.error("Error marking timeslot as booked:", error);
    return {
      error: error,
      message: "error marking timeslot as booked",
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    } as ErrorReturn;
  }
};
