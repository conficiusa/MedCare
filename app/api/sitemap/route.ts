import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async () => {
  await connectToDatabase();
  // Fetch all doctor profiles
  const doctors = await User.find({ role: "doctor" }).exec();
  // Generate XML for the sitemap
  const urlEntries = doctors
    .map((doctor) => {
      return `
      <url>
        <loc>https://yourwebsite.com/find-a-doctor/${doctor._id}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://yourwebsite.com/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://yourwebsite.com/find-a-doctor/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      ${urlEntries}
    </urlset>`;

  return NextResponse.json(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
