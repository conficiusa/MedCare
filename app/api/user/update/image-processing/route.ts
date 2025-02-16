import { NextResponse } from "next/server";
import { auth } from "@/auth";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { ProfilePicturesFolder } from "@/lib/constants";
import { nanoid } from "nanoid";

export const POST = auth(async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
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
      .resize(100, 100, { fit: "cover", width: 100, height: 100 })
      .toBuffer();

    // Upload original image
    const [originalUpload, thumbnailUpload] = await Promise.all([
      put(`${ProfilePicturesFolder}/${file.name + nanoid()}`, buffer, {
        access: "public",
      }),
      put(
        `${ProfilePicturesFolder}/thumbnails/${file.name + nanoid()}`,
        thumbnailBuffer,
        {
          access: "public",
        }
      ),
    ]);

    return NextResponse.json(
      {
        originalUrl: originalUpload.url,
        thumbnailUrl: thumbnailUpload.url,
      },
      { status: 200 }
    );
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
