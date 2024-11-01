import connectToDatabase from "./mongoose";
import User from "@/models/User";
import { applyQueryOptions, applyCaseInsensitiveRegex } from "@/lib/utils";
import Availability from "@/models/Availability";
import mongoose from "mongoose";
import { AvailabilityType, Doctor } from "@/lib/definitions";

interface QueryOptions {
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  page?: number;
}
export const fetchDoctorCardData = async (options: QueryOptions) => {
  try {
    await connectToDatabase();
    const defaultFilter = { role: "doctor" };
    let filter = { ...defaultFilter, ...options.filter };
    filter = { ...filter, ...applyCaseInsensitiveRegex(filter) };

    let query = User.find().select(["name", "image", "doctorInfo"]);

    query = applyQueryOptions(query, { ...options, filter });
    const doctors = await query.exec();

    return doctors.map((doc) => doc.toObject());
  } catch (error: any) {
    console.error("Error fetching doctors", error);
    throw new Error("Error fetching doctors");
  }
};
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
    console.log(doctor);
    if (!doctor) {
      return null;
    }
    const plainDoctor = doctor.toObject();
    const plainAvailability = availability.map((doc) => ({
      id: doc.id.toString(),
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
