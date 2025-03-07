import { IMedicalRecords } from "@/lib/definitions";
import { model, models, Schema } from "mongoose";
import { Model } from "mongoose";

const MedicalRecordSchema = new Schema<IMedicalRecords, Model<IMedicalRecords>>(
	{
		patientId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
		doctorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
		appointmentId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Appointment",
		},
		report: {
			patientName: { type: String, required: true },
			consultationTime: { type: String, required: true },
			chiefComplaint: { type: String, required: true },
			dateOfBirth: { type: String, required: true },
			clinicalInvestigations: {
				labTests: { type: [String] },
				imaging: { type: [String] },
			},
			consultationDate: { type: String, required: true },
			historyOfPresentIllness: { type: String, required: true },
			assessment: { type: String, required: true },
			diagnosis: { type: String },
			treatmentPlan: { type: String },
			prescriptions: {
				type: [
					{
						medication: { type: String },
						dosage: { type: String },
						frequency: { type: String },
						duration: { type: String },
						instructions: { type: String },
					},
				],
			},
			recommendation: { type: String, required: true },
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform: (doc, ret) => {
				ret.id = ret._id.toString();
				ret.doctorId = ret.doctorId.toString();
				ret.patientId = ret.patientId.toString();
				ret.appointmentId = ret.appointmentId.toString();
				delete ret._id;
				delete ret.__v;
			},
		},
		toObject: {
			virtuals: true,
			transform: (doc, ret) => {
				ret.id = ret._id.toString();
				ret.doctorId = ret.doctorId.toString();
				ret.patientId = ret.patientId.toString();
				ret.appointmentId = ret.appointmentId.toString();
				delete ret._id;
				delete ret.__v;
			},
		},
	}
);

MedicalRecordSchema.index(
	{ patientId: 1, doctorId: 1, appointmentId: 1 },
	{ unique: true }
);
const MedicalRecord =
	models.MedicalRecord ||
	model<IMedicalRecords>("MedicalRecord", MedicalRecordSchema);

export default MedicalRecord;
