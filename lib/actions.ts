"use server";
import { auth, signIn } from "@/auth";
import { AuthError, Session } from "next-auth";
import {
  isBefore,
  isAfter,
  differenceInMinutes,
  parseISO,
  isEqual,
  startOfMinute,
  subMinutes,
} from "date-fns";
import {
  availabilitySchema,
  IAppointmentSchema,
  reviewSchema,
  SignInSchema,
  subaccountDataSchema,
} from "@/lib/schema";
import connectToDatabase from "@/lib/mongoose";
import { put } from "@vercel/blob";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import {
  Appointment as AppointmentType,
  AvailabilityType,
  Doctor,
  ErrorReturn,
  ITimeSlot,
  IUser,
  Patient,
  ReturnType,
  ReviewType,
  subaccountData,
  SuccessReturn,
} from "@/lib//definitions";
import { MongooseError } from "mongoose";
import User from "@/models/User";
import { isRedirectError } from "next/dist/client/components/redirect";
import Availability from "@/models/Availability";
import Appointment from "@/models/Appointment";
import { sendEmail } from "@/app/api/utils/email";
import Review from "@/models/Reviews";
import mongoose from "mongoose";
import { SendWelcomeEmail } from "./jobs";
import { patientOnboardemail } from "./emails";

export const Authenticate = async (
  session: Session | null
): Promise<ReturnType> => {
  if (!session) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to create an appointment",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }
  return {
    data: session,
    message: "Authenticated",
    status: "success",
    statusCode: 200,
  } as SuccessReturn;
};

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
      redirectTo: callbackUrl ?? "/",
    });

    return {
      message: "Email sent",
      status: "success",
      statusCode: 200,
      data: {},
    } as SuccessReturn;
  } catch (error: any) {
    console.error(error.message);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid Credentials",
            type: "Credentials Error",
            status: "fail",
            statusCode: 401,
            error: error.message,
          };
        case "CallbackRouteError":
          return {
            message:
              "This account was likely created with a different provider.",
            type: "Callback Error",
            status: "fail",
            statusCode: 400,
            error: error.message,
          };
        default:
          return {
            message: "An unexpected error occurred.",
            type: "Unexpected Error",
            status: "fail",
            statusCode: 500,
            error: error.message,
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
      callbackUrl: redirect ?? "/",
      redirectTo: redirect ?? "/",
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

    if (authsession?.user?.id === appointmentData?.doctor?.doctorId) {
      return {
        error: "Invalid Appointment",
        message: "You cannot book an appointment with yourself",
        status: "fail",
        statusCode: 400,
        type: "Bad Request",
      } as ErrorReturn;
    }
    // Find the doctor
    const doctor = await User.findById(
      appointmentData?.doctor?.doctorId
    ).select(["name", "image", "email"]);

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
        email: doctor?.email,
      },
      patient: {
        image: authsession?.user?.image,
        name: authsession?.user?.name,
        patientId: authsession?.user?.id,
        email: authsession?.user?.email,
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
      console.error(
        "Appoinment created but slot still available",
        appointment.toObject()
      );
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
      error: error?.message,
      message: "An unexpected error occurred",
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    } as ErrorReturn;
  }
};

export async function upload(formData: FormData): Promise<ReturnType> {
  const authSession = await auth();

  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to upload a file",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }
  const file = formData.get("file") as File;
  const filename = `${Date.now()}-${file.name}`;
  if (!file) {
    throw new Error("No file uploaded");
  }
  try {
    const blob = await put(filename, file, {
      access: "public",
    });
    revalidatePath("/");
    return {
      data: blob,
      message: "upload successful",
      status: "success",
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      error: error,
      message: "Error uploading file",
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    };
  }
}

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

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
// Generic onboarding handler
export const handleDoctorOnboarding = async (
  step: number,
  data: any,
  schema: z.ZodSchema,
  fieldMap: DeepPartial<Doctor>
): Promise<ReturnType> => {
  const authSession = await auth();
  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to complete onboarding process",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }

  try {
    connectToDatabase();
    // Validate data using the provided schema
    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      return {
        error: parsedData.error.flatten().fieldErrors,
        message: "Invalid data",
        status: "fail",
        statusCode: 400,
        type: "ValidationError",
      } as ErrorReturn;
    }

    // Add onboarding level dynamically
    const updateData: DeepPartial<Doctor> = {
      ...fieldMap,
      onboarding_level: step,
    };

    const updatedDoctor = await User.findByIdAndUpdate(
      authSession.user.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDoctor) {
      return {
        error: "Bad Request",
        message: "Onboarding process failed",
        status: "fail",
        statusCode: 400,
        type: "Database error",
      } as ErrorReturn;
    }

    revalidateTag("user");
    return {
      data: updatedDoctor.toObject(),
      message: `Step ${step} completed successfully.`,
      status: "success",
      statusCode: 200,
    } as SuccessReturn;
  } catch (error: any) {
    console.error(error);
    return {
      error: "A server error occured",
      message: error.message,
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    } as ErrorReturn;
  }
};
export const handlePatientOnboarding = async (
  step: number,
  data: any,
  schema: z.ZodSchema,
  fieldMap: DeepPartial<Patient>
): Promise<ReturnType> => {
  const authSession = await auth();
  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to complete onboarding process",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }

  try {
    connectToDatabase();
    // Validate data using the provided schema
    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      return {
        error: parsedData.error.flatten().fieldErrors,
        message: "Invalid data",
        status: "fail",
        statusCode: 400,
        type: "ValidationError",
      } as ErrorReturn;
    }

    // Add onboarding level dynamically
    const updateData: DeepPartial<Doctor> = {
      ...fieldMap,
      onboarding_level: step,
    };

    const updatedPatient = await User.findByIdAndUpdate(
      authSession.user.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPatient) {
      return {
        error: "Bad Request",
        message: "Onboarding process failed",
        status: "fail",
        statusCode: 400,
        type: "Database error",
      } as ErrorReturn;
    }

    revalidateTag("user");
    revalidatePath("/");
    return {
      data: updatedPatient.toObject(),
      message: `Step ${step} completed successfully.`,
      status: "success",
      statusCode: 200,
    } as SuccessReturn;
  } catch (error: any) {
    console.error(error);
    return {
      error: "A server error occured",
      message: error.message,
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    } as ErrorReturn;
  }
};

export const sendEmailAction = async (
  recipient: string,
  subject: string,
  body: string
) => {
  try {
    await SendWelcomeEmail.dispatch({ body, recipient, subject });
    return {
      message: "Email sent",
      status: "success",
      statusCode: 200,
      data: {},
    } as SuccessReturn;
  } catch (error: any) {
    console.error(error);
    return {
      message: "An unexpected error occurred.",
      type: "Unexpected Error",
      status: "fail",
      statusCode: 500,
      error: error,
    };
  }
};

export const verifyDoctorAccount = async (id: string): Promise<ReturnType> => {
  try {
    const authSession = await auth();
    if (!authSession) {
      return {
        error: "Not Authenticated",
        message: "You must be logged in to verify a doctor",
        status: "fail",
        statusCode: 401,
        type: "Authentication Error",
      } as ErrorReturn;
    }
    const doctor: IUser | null = await User.findById(id);
    //check if doctor exists
    if (!doctor) {
      return {
        error: "Doctor not found",
        message: "The doctor you are trying to verify does not exist",
        status: "fail",
        statusCode: 404,
        type: "Not Found",
      } as ErrorReturn;
    }

    //check if the user is a doctor
    if (doctor.role !== "doctor") {
      return {
        error: "Invalid Role",
        message: "The user is not a doctor",
        status: "fail",
        statusCode: 400,
        type: "Bad Request",
      } as ErrorReturn;
    }

    if (doctor?.doctorInfo) {
      doctor.doctorInfo.verification = "approved";
      await doctor.save();
    } else {
      return {
        error: "Invalid Data",
        message: "The user is not a doctor",
        status: "fail",
        statusCode: 400,
        type: "Bad Request",
      } as ErrorReturn;
    }
    //create subaccount with paystack

    let accountNumber = doctor?.doctorInfo?.account_number;
    if (accountNumber?.startsWith("+233")) {
      accountNumber = "0" + accountNumber.slice(4);
    }

    const subaccountdata: subaccountData = {
      account_number: accountNumber,
      bank_code: doctor?.doctorInfo?.bank,
      business_name: `Dr. ${doctor.name}`,
      percentage_charge: 85,
      primary_contact_email: doctor?.email,
      primary_contact_name: doctor?.name,
      primary_contact_phone: doctor?.phone as string,
      settlement_bank: doctor?.doctorInfo?.bank,
    };
    const subaccount = await createSubaccountAction(subaccountdata);
    if (subaccount.status === "fail") {
      return subaccount;
    }
    return {
      data: {
        doctor: doctor.toObject(),
        subaccount,
      },
      message: "Doctor verified successfully",
      status: "success",
      statusCode: 200,
    } as SuccessReturn;
  } catch (error: any) {
    console.error(error);
    return {
      error: "An unexpected error occurred",
      message: error.message,
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    } as ErrorReturn;
  }
};

export const createSubaccountAction = async (
  params: subaccountData
): Promise<ReturnType> => {
  try {
    const parsedData = subaccountDataSchema.safeParse(params);
    if (!parsedData?.success) {
      return {
        error: parsedData.error.flatten().fieldErrors,
        message: "Invalid data",
        status: "fail",
        statusCode: 400,
        type: "ValidationError",
      } as ErrorReturn;
    }
    const response = await fetch("https://api.paystack.co/subaccount", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data);
      return {
        error: "Subaccount creation failed",
        message: "An error occurred while creating subaccount",
        status: "fail",
        statusCode: 500,
        type: "Server error",
      };
    }
    return {
      data: data,
      message: "Subaccount created successfully",
      status: "success",
      statusCode: 200,
    };
  } catch (error: any) {
    console.error(error);
    return {
      error: error,
      message: error?.message || "An unexpected error occurred",
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    } as ErrorReturn;
  }
};

export const createAvailability = async (
  data: DeepPartial<AvailabilityType>
): Promise<ReturnType> => {
  const authSession = await auth();
  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to create availability",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }

  try {
    await connectToDatabase();

    const parsedData = availabilitySchema.safeParse(data);
    if (!parsedData?.success) {
      console.error(parsedData.error.flatten().fieldErrors);
      return {
        error: parsedData.error.flatten().fieldErrors,
        message: "Invalid data",
        status: "fail",
        statusCode: 400,
        type: "ValidationError",
      } as ErrorReturn;
    }

    const { timeSlots, date } = data;
    if (!timeSlots || timeSlots.length === 0) {
      return {
        error: "Time slots are required",
        message: "No time slots provided",
        status: "fail",
        statusCode: 400,
        type: "ValidationError",
      } as ErrorReturn;
    }

    const startTime = parseISO(timeSlots[0]?.startTime as string);
    const endTime = parseISO(timeSlots[0]?.endTime as string);

    const now = startOfMinute(new Date()); // Round down 'now' to the start of the current minute
    const allowedPastTime = subMinutes(now, 1); // Allow times up to 1 minute in the past
    const startOfSlot = startOfMinute(startTime); // Round down 'startTime' to the start of its minute

    if (isBefore(startOfSlot, allowedPastTime)) {
      return {
        error: "Invalid start time",
        message: "Start time cannot be in the past",
        status: "fail",
        statusCode: 400,
        type: "ValidationError",
      } as ErrorReturn;
    }
    // Validate slot duration
    const slotDuration = differenceInMinutes(endTime, startTime);
    if (slotDuration < 15 || slotDuration > 60) {
      return {
        error: "Invalid slot duration",
        message: "Time slots must be between 15 minutes and 1 hour",
        status: "fail",
        statusCode: 400,
        type: "ValidationError",
      } as ErrorReturn;
    }

    // Check for overlapping slots
    const existingAvailability = await Availability.findOne({
      doctorId: authSession?.user?.id,
      date,
    });

    if (existingAvailability) {
      for (const existingSlot of existingAvailability.timeSlots) {
        const existingStart = parseISO(existingSlot.startTime);
        const existingEnd = parseISO(existingSlot.endTime);

        const startsWithin =
          isAfter(startTime, existingStart) && isBefore(startTime, existingEnd);
        const endsWithin =
          isAfter(endTime, existingStart) && isBefore(endTime, existingEnd);
        const encapsulates =
          isBefore(startTime, existingStart) && isAfter(endTime, existingEnd);
        const exactMatch =
          isEqual(startTime, existingStart) && isEqual(endTime, existingEnd);

        if (startsWithin || endsWithin || encapsulates || exactMatch) {
          return {
            error: "Overlapping time slots",
            message: "The selected period overlaps with an existing slot",
            status: "fail",
            statusCode: 400,
            type: "ValidationError",
          } as ErrorReturn;
        }
      }

      // Append new slot to existing slots
      existingAvailability.timeSlots =
        existingAvailability.timeSlots.concat(timeSlots);
      await existingAvailability.save();
      revalidateTag("availability");
      return {
        status: "success",
        message: "Slot created successfully",
        statusCode: 200,
        data: existingAvailability.toObject(),
      } as SuccessReturn;
    } else {
      // Create new availability
      const newAvailability = new Availability(data);
      await newAvailability.save();
      revalidateTag("availability");
      return {
        status: "success",
        message: "Slot created successfully",
        statusCode: 201,
        data: newAvailability.toObject(),
      } as SuccessReturn;
    }
  } catch (error: any) {
    console.log(error);
    return {
      error: error?.message,
      message: error?.message || "An unexpected error occurred",
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    } as ErrorReturn;
  }
};
export const deleteSlot = async (slotId: string): Promise<ReturnType> => {
  const authSession = await auth();
  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to delete slot",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }

  try {
    await connectToDatabase();
    const availability = await Availability.findOne({
      "timeSlots.slotId": slotId,
    });
    if (!availability) {
      return {
        error: "Slot not found",
        message: "The slot you are trying to delete does not exist",
        status: "fail",
        statusCode: 404,
        type: "Not Found",
      } as ErrorReturn;
    }
    availability.timeSlots = availability.timeSlots.filter(
      (slot: ITimeSlot) => slot.slotId !== slotId
    );

    if (availability.timeSlots.length === 0) {
      // Delete the availability if no timeslots remain
      await Availability.deleteOne({ _id: availability._id });
    } else {
      // Save the updated availability
      await availability.save();
    }

    revalidateTag("availability");
    return {
      status: "success",
      message: "Slot deleted successfully",
      statusCode: 203,
    } as SuccessReturn;
  } catch (error: any) {
    console.error(error);
    return {
      error: error?.message,
      message: "An unexpected error occurred",
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    } as ErrorReturn;
  }
};

export const markAppointmentComplete = async (
  appointmentId: string
): Promise<ReturnType> => {
  try {
    if (!appointmentId) {
      return {
        error: "Missing appointment ID",
        message: "Appointment ID is required",
        status: "fail",
        statusCode: 400,
        type: "Bad Request",
      } as ErrorReturn;
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return {
        error: "Appointment not found",
        message: "The appointment you are trying to mark does not exist",
        status: "fail",
        statusCode: 404,
        type: "Not Found",
      } as ErrorReturn;
    }
    appointment.status = "completed";
    appointment.completedAt = new Date();
    await appointment.save();
    return {
      status: "success",
      message: "Appointment marked as completed",
      statusCode: 200,
      data: appointment.toObject(),
    } as SuccessReturn;
  } catch (error: any) {
    console.error(error);
    return {
      error: error?.message,
      message: "An unexpected error occurred",
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    } as ErrorReturn;
  }
};

export const addReview = async (data: Partial<ReviewType>) => {
  const authSession = await auth();
  if (!authSession) {
    return {
      error: "Not Authenticated",
      message: "You must be logged in to add a review",
      status: "fail",
      statusCode: 401,
      type: "Authentication Error",
    } as ErrorReturn;
  }

  try {
    await connectToDatabase();
    const parsedData = reviewSchema.safeParse(data);
    if (!parsedData.success) {
      return {
        error: parsedData.error.flatten().fieldErrors,
        message: "Invalid data",
        status: "fail",
        statusCode: 400,
        type: "ValidationError",
      } as ErrorReturn;
    }

    const review = new Review(data);
    await review.save();
    await updateDoctorRating(data.doctorId ?? "");
    return {
      status: "success",
      message: "Your review has been recorded",
      statusCode: 201,
      data: review.toObject(),
    } as SuccessReturn;
  } catch (error: any) {
    console.error(error);
    return {
      error: error?.message,
      message: "An unexpected error occurred",
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    } as ErrorReturn;
  }
};
const updateDoctorRating = async (doctorId: string) => {
  const result = await Review.aggregate([
    { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
    {
      $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } },
    },
  ]);

  if (result.length > 0) {
    await User.findByIdAndUpdate(doctorId, {
      "doctorInfo.rating": result[0].avgRating.toFixed(1),
      // "doctorInfo.reviewCount": result[0].count,
    });
  }
};
