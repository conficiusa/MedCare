import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongoose";
import { PatientOnboardingSchema } from "@/lib/schema";
import Patient from "@/models/Patient";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { z } from "zod";

export const PATCH = auth(async function PATCH(req) {
  try {
    //geting the user session
    const session = await auth();
    console.log(session?.user.id, "session");
    // Connect to the database
    await connectToDatabase();

    //get data from requiest
    const data: z.output<typeof PatientOnboardingSchema> = await req.json();

    const {
      city,
      conditions,
      country,
      digitalAddress,
      dob,
      gender,
      languages,
      medicalHistory,
      phone,
      region,
      role,
      street,
    } = data;

    //updating user doc
    const user = await User.findById(session?.user.id);
    console.log(user, "user");
    const updatedUser = await User.findByIdAndUpdate(
      session?.user.id,
      {
        country,
        city,
        dob,
        gender,
        phone,
        digitalAddress,
        region,
        street,
        role,
        languages,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    const updatedProfile = await Patient.create({
      medicalHistory,
      conditions,
      userId: session?.user.id,
    });

    return NextResponse.json(
      {
        data: {
          session: session,
          user: { ...updatedUser, updatedProfile },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
});
