import { MetadataRoute } from 'next';
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import { ENVConfig } from '@/lib/utils';

const DOMAIN = ENVConfig.getAppURL();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectToDatabase();
  // Fetch all published doctor profiles
  const doctors = await User.find({
    role: "doctor",
    "doctorInfo.verification": "approved",
  });

  // Static routes with proper type for changeFrequency
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${DOMAIN}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${DOMAIN}/find-a-doctor`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/sign-in`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Generate doctor routes with proper typing
  const doctorRoutes: MetadataRoute.Sitemap = doctors.map((doctor) => ({
    url: `${DOMAIN}/find-a-doctor/${doctor.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...doctorRoutes];
}