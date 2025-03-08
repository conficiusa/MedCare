import connectToDatabase from "@/lib/mongoose";
import Availability from "@/models/Availability";
import { NextResponse } from "next/server";
import { sendEmail } from "../../utils/email";

// Function to delete outdated availabilities
const deleteOutdatedAvailabilities = async () => {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);

	await Availability.deleteMany({
		date: { $lt: yesterday },
	});
};
// Route handler
export async function POST() {
	await sendEmail("addawebadua@gmail.com", "subject", "hello");
	try {
		await connectToDatabase();
		await deleteOutdatedAvailabilities();

		return NextResponse.json({
			message: "Outdated availabilities deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting outdated availabilities:", error);
		return NextResponse.json(
			{ message: "Failed to delete outdated availabilities" },
			{ status: 500 }
		);
	}
}
