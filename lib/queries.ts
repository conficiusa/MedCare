"use server";
import connectToDatabase from "./mongoose";
import { applyCaseInsensitiveRegex, applyQueryOptions } from "@/lib/utils";
import Availability from "@/models/Availability";
import mongoose from "mongoose";
import {
  Appointment as AppointmentType,
  AvailabilityType,
  Doctor,
  DoctorCard,
  ReturnType,
} from "@/lib/definitions";
import { buildDoctorAggregationPipeline } from "@/lib/aggregations";
import { auth } from "@/auth";
import Appointment from "@/models/Appointment";
import { cache as reactcache } from "react";
import { redirect } from "next/navigation";
import { startOfDay } from "date-fns";
import User from "@/models/User";
import { unstable_cache as nextcache } from "next/cache";
import Review from "@/models/Reviews";
import { ReviewsPerPage } from "./constants";

interface QueryOptions {
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  page?: number;
}

// Fetch doctor card data
export const fetchDoctorCardData = async (
  options: QueryOptions,
  queryterm?: string,
  showall?: boolean
): Promise<ReturnType> => {
  await connectToDatabase();
  const defaultFilter = { role: "doctor" };
  let filter = { ...defaultFilter, ...options.filter };
  filter = { ...filter, ...applyCaseInsensitiveRegex(filter) };

  // Build the aggregation pipeline using the utility function
  const pipeline = buildDoctorAggregationPipeline(
    filter,
    options,
    queryterm,
    showall
  );

  // Execute the aggregation
  const doctors = await User.aggregate(pipeline);
  // Manually apply the transformation
  const transformedDoctors = doctors.map((doc) => {
    const ret = { ...doc }; // Spread the document into a new object
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  });

  // If no doctors are found, return a 404
  if (transformedDoctors.length === 0) {
    return {
      error: "No doctors match you query",
      message: "Adjust your query if set. or check back later",
      status: "fail",
      statusCode: 404,
      type: "Not found",
    };
  }
  return {
    data: transformedDoctors as DoctorCard[],
    statusCode: 200,
    message: "Load success",
    status: "success",
  };
};

//fetch doctor dynamic data
export const fetchDoctorData = async (id: string): Promise<ReturnType> => {
  try {
    const authsession = await auth();
    if (!authsession) {
      redirect("/sign-in");
    }
    const today = new Date();
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`Invalid Doctor ID: ${id}`);
      return {
        error: "Invalid Doctor ID",
        message: "Invalid Doctor ID",
        status: "fail",
        statusCode: 400,
        type: "Bad Request",
      };
    }

    let doctorQuery = User.findById(id);
    let availabilityQuery = Availability.find({
      doctorId: new mongoose.Types.ObjectId(id),
      $or: [{ date: { $gte: startOfDay(new Date()) } }],
    });

    const [doctor, availability] = await Promise.all([
      doctorQuery.exec(),
      availabilityQuery.exec(),
    ]);
    if (!doctor) {
      return {
        error: "Doctor not found",
        message: "Doctor not found",
        status: "fail",
        statusCode: 404,
        type: "Not found",
      };
    }
    const plainDoctor = doctor.toObject();
    const plainAvailability = availability.map((doc) => ({
      id: doc.id.toString(),
      doctorId: doc.doctorId.toString(),
      ...doc.toObject(),
    }));
    return {
      data: {
        doctor: plainDoctor as Doctor,
        availability: plainAvailability as AvailabilityType[],
      },
      statusCode: 200,
      message: "Load success",
      status: "success",
    };
  } catch (error: any) {
    console.error("Could not load Doctor", error.stack || error);
    return {
      error: "Could not load Doctor",
      message: error?.message,
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    };
  }
};

export const fetchUserAppointments = reactcache(
  async (id: string, queryOptions: QueryOptions) => {
    try {
      const authsession = await auth();
      if (!authsession) {
        redirect("/sign-in");
      }
      await connectToDatabase();
      const defaultFilter = {
        $or: [{ "doctor.doctorId": id }, { "patient.patientId": id }],
      };
      const filter = { ...defaultFilter, ...queryOptions.filter };
      let query = Appointment.find();
      query = applyQueryOptions(query, { ...queryOptions, filter });
      const appointments = await query.exec();
      const plainAppointments = appointments?.map((doc) => ({
        id: doc.id.toString(),
        doctor: {
          doctorId: doc.doctor.doctorId.toString(),
          name: doc.doctor.name,
          image: doc.doctor.image,
        },
        patient: {
          patientId: doc.patient.patientId.toString(),
          name: doc.patient.name,
          image: doc.patient.image,
        },
        ...doc.toObject(),
      })) as AppointmentType[];

      return plainAppointments;
    } catch (error) {
      console.error("Error fetching appointments", error);
      throw new Error("Error fetching appointments");
    }
  }
);

export const findTimeSlotBySlotId = async (slotId: string) => {
  try {
    await connectToDatabase();
    const result = await Availability.aggregate([
      { $unwind: "$timeSlots" }, // Unwind each timeslot as a separate document
      { $match: { "timeSlots.slotId": slotId } }, // Match timeslot by slotId
      { $project: { timeSlot: "$timeSlots", _id: 0 } }, // Project only the matched timeslot
    ]);

    if (result.length === 0) {
      console.log("No timeslot found with the given slot ID.");
      throw new Error("The timeSlot is not available. Please select another.");
    }
    const slot = result[0].timeSlot;

    return {
      ...slot,
      patientId: slot.patientId?.toString(),
    };
  } catch (error: any) {
    console.error("Error finding timeslot:", error);
    throw new Error("Error finding timeslot");
  }
};

export const FetchAppointment = async (id: string): Promise<ReturnType> => {
  try {
    const authsession = await auth();
    if (!authsession) {
      redirect("/sign-in");
    }
    await connectToDatabase();
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return {
        message: "Appointment not found",
        error: "Appointment not found",
        status: "fail",
        type: "not found",
        statusCode: 404,
      };
    }
    const plainAppointment = appointment?.toObject();
    return {
      data: plainAppointment as Partial<AppointmentType>,
      message: "appointment retrieved",
      status: "success",
      statusCode: 200,
    };
  } catch (error: any) {
    console.error(error);
    return {
      error: error?.message || "Failed to retrieve data",
      message: "Failed to retrieve data",
      type: "Server Error",
      status: "fail",
      statusCode: 500,
    };
  }
};
export const FetchAppointmentByRoomId = async (
  id: string
): Promise<ReturnType> => {
  try {
    const authsession = await auth();
    if (!authsession) {
      redirect("/sign-in");
    }
    await connectToDatabase();
    const appointment = await Appointment.findOne({ "room.name": id });
    if (!appointment) {
      return {
        message: "Appointment not found",
        error: "Appointment not found",
        status: "fail",
        statusCode: 404,
        type: "Not found",
      };
    }
    const plainAppointment = appointment?.toObject();
    return {
      data: plainAppointment as Partial<AppointmentType>,
      status: "success",
      statusCode: 200,
      message: "Appointments",
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Could not load appointment data",
      error: error?.message,
      status: "fail",
      statusCode: 500,
      type: "Server Error",
    };
  }
};

export const fetchUserData = nextcache(
  async (id: string): Promise<ReturnType> => {
    try {
      const user = await User.findById(id);

      if (!user) {
        return {
          error: "User not found",
          message: "Failed to fetch user data",
          status: "fail",
          statusCode: 404,
          type: "Not found",
        };
      }

      return {
        data: user.toObject(),
        message: "user fetched succesfully",
        statusCode: 200,
        status: "success",
      };
    } catch (error) {
      console.error(error);
      return {
        error: "Server error occured",
        message: "Failed to fetch user data",
        status: "fail",
        statusCode: 404,
        type: "Server error",
      };
    }
  },
  ["user"],
  { revalidate: 3600, tags: ["user"] }
);

export const fetchDoctorAvailibility = nextcache(
  async (id: string): Promise<ReturnType> => {
    try {
      await connectToDatabase();
      const availabilities = await Availability.find({
        doctorId: new mongoose.Types.ObjectId(id),
      }).sort({ date: 1 });

      if (!availabilities || availabilities.length === 0) {
        return {
          error: "No open slots found",
          message: "No open slots found",
          status: "fail",
          statusCode: 404,
          type: "Not found",
        };
      }

      return {
        data: availabilities.map((doc) => ({
          id: doc.id.toString(),
          doctorId: doc.doctorId.toString(),
          ...doc.toObject(),
        })),
        statusCode: 200,
        message: "Load success",
        status: "success",
      };
    } catch (error: any) {
      return {
        error: "Failed to fetch open slots",
        message: error?.message,
        status: "fail",
        statusCode: 500,
        type: "Server error",
      };
    }
  },
  ["availability"],
  { revalidate: 3600, tags: ["availability"] }
);

export const fetchDoctorReviews = async (
  id: string,
  skip: number
): Promise<ReturnType> => {
  try {
    const session = await auth();
    if (!session) {
      redirect("/sign-in");
    }
    if (!id || typeof id !== "string") {
      return {
        error: "Invalid Doctor ID",
        message: "Invalid Doctor ID",
        status: "fail",
        statusCode: 400,
        type: "Bad Request",
      };
    }
    const Reviews = await Review.find({
      doctorId: id,
      comment: { $exists: true, $ne: "" },
    })
      .skip(skip)
      .limit(ReviewsPerPage)
      .sort({ createdAt: -1 });
    if (!Reviews) {
      return {
        error: "No reviews found",
        message: "No reviews found",
        status: "fail",
        statusCode: 404,
        type: "Not found",
      };
    }
    const ReviewsArray = Reviews.map((doc) => ({
      id: doc.id.toString(),
      doctorId: doc.doctorId.toString(),
      userId: doc.userId.toString(),
      ...doc.toObject(),
    }));

    return {
      data: ReviewsArray,
      message: "Reviews fetched successfully",
      status: "success",
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Server Error",
      message: "Failed to fetch reviews",
      status: "fail",
      statusCode: 500,
      type: "Bad Request",
    };
  }
};
