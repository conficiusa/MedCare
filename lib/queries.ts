import connectToDatabase from "./mongoose";
import User from "@/models/User";
import { applyCaseInsensitiveRegex } from "@/lib/utils";
import Availability from "@/models/Availability";
import mongoose from "mongoose";
import { AvailabilityType, Doctor } from "@/lib/definitions";
import { buildDoctorAggregationPipeline } from "@/lib/aggregations";

interface QueryOptions {
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  page?: number;
}

// Fetch doctor card data
export const fetchDoctorCardData = async (options: QueryOptions) => {
  try {
    await connectToDatabase();

    const defaultFilter = { role: "doctor" };
    let filter = { ...defaultFilter, ...options.filter };
    filter = { ...filter, ...applyCaseInsensitiveRegex(filter) };

    // Build the aggregation pipeline using the utility function
    const pipeline = buildDoctorAggregationPipeline(filter, options);

    // Execute the aggregation
    const doctors = await mongoose.model("User").aggregate(pipeline);

    // Manually apply the transformation
    const transformedDoctors = doctors.map((doc) => {
      const ret = { ...doc }; // Spread the document into a new object
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
  });

    return transformedDoctors;
  } catch (error: any) {
    console.error("Error fetching doctors", error);
    throw new Error("Error fetching doctors");
  }
};

//fetch doctor dynamic data
export const fetchDoctorData = async (id: string) => {
  try {
    const today = new Date();
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`Invalid Doctor ID: ${id}`);
      return { doctor: null, availability: [] };
    }

    let doctorQuery = User.findById(id).select("-password");
    let availabilityQuery = Availability.find({
      doctorId: new mongoose.Types.ObjectId(id),
      $or: [
        { date: { $gt: today } },
        {
          date: today,
          timeSlots: {
            $elemMatch: {
              $gte: new Date().toISOString().split("T")[1], // Filter for time slots after current time
            },
          },
        },
      ],
    });

    const [doctor, availability] = await Promise.all([
      doctorQuery.exec(),
      availabilityQuery.exec(),
    ]);
    if (!doctor) {
      return null;
    }
    const plainDoctor = doctor.toObject();
    const plainAvailability = availability.map((doc) => ({
      id: doc.id.toString(),
      doctorId: doc.doctorId.toString(),
      ...doc.toObject(),
    }));
    return {
      doctor: plainDoctor as Doctor,
      availability: plainAvailability as AvailabilityType[],
    };
  } catch (error: any) {
    console.error("Could not load Doctor", error.stack || error);
    throw new Error("Error fetching doctor");
  }
};
