import { formSchema } from "@/app/consultation/report/[id]/components/schema";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { coll, connectRegularClient } from "../../utils/encryptionClient";
import { encryptionFields } from "../../utils/encryptedFields";
import connectToDatabase from "@/lib/mongoose";
import MedicalRecord from "@/models/medicalRecords";
import Appointment from "@/models/Appointment";

export const POST = auth(async function POST(req): Promise<NextResponse> {
  try {
    if (!req.auth) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const parsedBody = formSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsedBody.error },
        { status: 400 }
      );
    }
    if (parsedBody.data.doctorId.trim() !== req.auth.user.id) {
      NextResponse.json(
        {
          success: false,
          error: "You are not authorized to create this resource",
        },
        { status: 403 }
      );
    }

    let appointment = await Appointment.findById(parsedBody.data.appointmentId);

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    appointment = appointment.toObject();
    if (appointment.doctor.doctorId !== parsedBody.data.doctorId) {

      return NextResponse.json(
        { error: "You are not authorized to create this resource" },
        { status: 403 }
      );
    }

    if (appointment.reportId) {
      return NextResponse.json(
        { error: "Report already exists for this appointment" },
        { status: 409 }
      );
    }

    const { patientId, doctorId, appointmentId, ...report } = parsedBody.data;

    // Create a function to transform arrays by extracting only the value property
    const transformArray = (arr?: { value: string; label: string }[]) =>
      arr?.map((item) => item.value) || [];

    // Process the clinical investigations
    const clinicalInvestigations = {
      ...report.clinicalInvestigations,
      lab_tests: transformArray(report.clinicalInvestigations?.lab_tests),
      imaging: transformArray(report.clinicalInvestigations?.imaging),
    };

    // Create the record with transformed data
    const record = {
      patientId: new ObjectId(patientId),
      doctorId: new ObjectId(doctorId.toString()),
      appointmentId: new ObjectId(appointmentId),
      report: {
        ...report,
        clinicalInvestigations,
      },
    };

    await connectToDatabase();

    const encryptedRecord = await encryptionFields(record);
    const result = await coll.insertOne(encryptedRecord);
    const recordId = result.insertedId;
    await Appointment.findByIdAndUpdate(appointmentId, { reportId: recordId });
    return NextResponse.json({ result }, { status: 200 });
  } catch (error: any) {
    console.error("error", error);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
});
