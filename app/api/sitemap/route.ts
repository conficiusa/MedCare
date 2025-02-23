import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "https://medcare.com";

export const GET = async () => {
  await connectToDatabase();
  // Fetch all published doctor profiles
  const doctors = await User.find({ role: "doctor" });

  console.log(doctors.length);
  // Static routes
  const staticRoutes = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/find-a-doctor", priority: "0.9", changefreq: "daily" },
    { url: "/sign-in", priority: "0.8", changefreq: "monthly" },
  ];

  const staticUrlEntries = staticRoutes
    .map(
      ({ url, priority, changefreq }) => `
      <url>
        <loc>${DOMAIN}${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
      </url>
    `
    )
    .join("");

  // Dynamic doctor routes
  const doctorUrlEntries = doctors
    .map(
      (doctor) => `
      <url>
        <loc>${DOMAIN}/find-a-doctor/${doctor._id}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrlEntries}
      ${doctorUrlEntries}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
