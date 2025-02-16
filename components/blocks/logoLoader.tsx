import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { auth } from "@/auth";

export const GET = auth(async function GET(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Invalid file upload" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate thumbnail
    const thumbnailBuffer = await sharp(buffer)
      .resize(200, 200, { fit: "inside" })
      .toBuffer();

    // Upload original image
    const originalUpload = await put(`uploads/${file.name}`, buffer, {
      access: "public",
    });

    // Upload thumbnail
    const thumbnailUpload = await put(
      `uploads/thumbnails/${file.name}`,
      thumbnailBuffer,
      {
        access: "public",
      }
    );

    return NextResponse.json({
      originalUrl: originalUpload.url,
      thumbnailUrl: thumbnailUpload.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
});

export const config = {
  api: {
    bodyParser: false, // Required to handle formData
  },
};
