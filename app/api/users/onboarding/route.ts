import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongoose";
import { PatientOnboardingSchema } from "@/lib/schema";
import Patient from "@/models/Patient";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { z } from "zod";
import { put, PutBlobResult } from "@vercel/blob";

export const PATCH = auth(async function PATCH(req) {
  try {
    //geting the user session
    const session = await auth();
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
      image,
      phone,
      region,
      role,
      street,
    } = data;

    //uploading user image to vercel blob
    let blob: PutBlobResult | undefined;
    if (image) {
      try {
        const filename = `${session?.user.id}-${Date.now()}.png`; // Example filename
        // Extract Base64 data (remove the data URL prefix if present)
        const base64Data = image.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");

        // Upload image as buffer to Vercel Blob
        blob = await put(`profiles/${filename}`, buffer, {
          access: "public",
        });
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500 }
        );
      }
    }
    //updating user doc
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
        image: blob && blob.url,
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
