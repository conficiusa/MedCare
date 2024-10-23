import { toast } from "sonner";
import connectToDatabase from "./mongoose";
import User from "@/models/User";
import { applyQueryOptions, applyCaseInsensitiveRegex } from "@/lib/utils";

interface QueryOptions {
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  page?: number;
}
export const fetchDoctors = async (options: QueryOptions) => {
  try {
    await connectToDatabase();
    console.log("Fetching revenue data...");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const defaultFilter = { role: "doctor" };
    let filter = { ...defaultFilter, ...options.filter };
    filter = { ...filter, ...applyCaseInsensitiveRegex(filter) };

    let query = User.find().select("-password");
    query = applyQueryOptions(query, { ...options, filter });
    const doctors = await query.exec();
    return doctors;
  } catch (error: any) {
    console.error("Error fetching doctors:", error.stack || error);
    toast.error("Failed to fetch doctors");
    throw new Error("Error fetching doctors");
  }
};
