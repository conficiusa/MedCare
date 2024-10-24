import connectToDatabase from "./mongoose";
import User from "@/models/User";
import { applyQueryOptions, applyCaseInsensitiveRegex } from "@/lib/utils";
import { unstable_noStore as noStore } from "next/cache";
import Availability from "@/models/Availability";
import mongoose from "mongoose";
import { IAvailability, IUser } from "@/lib/definitions";

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
    return doctors;
  } catch (error: any) {
    console.error("Error fetching doctors:", error.stack || error);
    throw new Error("Error fetching doctors");
  }
};
export const fetchDoctorData = async (id: string) => {
  noStore();
  try {
    const today = new Date();
    await connectToDatabase();
    let doctorQuery = User.findById(id).select("-password");
    let availabilityQuery = Availability.find({
      doctorId: new mongoose.Types.ObjectId(id),
    });
    const [doctor, availability] = await Promise.all([
      doctorQuery.exec(),
      availabilityQuery.exec(),
    ]);
    const plainDoctor = doctor.toObject();
    const plainAvailability = availability.map((item) => ({
      ...item.toObject(),
      _id: item._id.toString(),
      doctorId: item.doctorId.toString(),
      date: item.date.toISOString(),
    }));
    return {
      doctor: plainDoctor as IUser,
      availability: plainAvailability as IAvailability[],
    };
  } catch (error: any) {
    console.error("Could not load Doctor", error.stack || error);
    throw new Error("Error fetching doctor");
  }
};
