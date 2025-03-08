import { z } from "zod";
import { formSchema } from "./schema";
import { Appointment, User } from "@/lib/definitions";
import moment from "moment";
/**
 *
 * @param appointment Represents the appointment object. this is used to populate the default immutable values
 * @returns Deafault options for a controlled form using react hook form
 */

export const defaultOptions = (
	appointment: Appointment,
	user: Partial<User>,
	id: string
): Partial<z.infer<typeof formSchema>> => {
	return {
		patientId: appointment?.patient?.patientId,
		doctorId: appointment?.doctor?.doctorId,
		appointmentId: id,
		patientName: appointment?.patient?.name,
		dateOfBirth: moment(user?.dob).format("YYYY-MM-DD"),
		chiefComplaint: "",
		historyOfPresentIllness: "",
		assessment: "",
		diagnosis: "",
		treatmentPlan: "",
		consultationDate: moment(appointment?.date).format("YYYY-MM-DD"),
		consultationTime: moment(appointment?.timeSlot?.startTime).format(
			"HH : mm a"
		),
		prescriptions: [
			{
				medication: "",
				dosage: "",
				frequency: "",
				duration: "",
				instructions: "",
			},
		],
		recommendation: "",
	} satisfies Partial<z.infer<typeof formSchema>>;
};
