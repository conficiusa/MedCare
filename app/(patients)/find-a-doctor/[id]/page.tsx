import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutDoctor from "@/components/blocks/doctorsAbout";
import ServiceDetails from "@/components/blocks/serviceDetails";
import { fetchDoctorData } from "@/lib/queries";
import { notFound } from "next/navigation";
import DoctorProfileAside from "@/components/blocks/doctorProfileAside";
import { Suspense } from "react";
import { DoctorProfileAsideSkeleton } from "@/components/skeletons/doctorProfileSkeletons";
import type { Metadata, ResolvingMetadata } from "next";
import { Doctor } from "@/lib/definitions";

interface Params {
  id: string;
}
interface DoctorProfileProps {
  params: Params;
}

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;
  // fetch data
  const data = await fetchDoctorData(params.id);
  if (data?.statusCode === 404) {
    notFound();
  }
  const previousImages = (await parent).openGraph?.images || [];
  if (!data || !("data" in data)) {
    throw new Error(data?.message || "Something went wrong", {
      cause: data?.message,
    });
  }
  const doctor: Doctor = data.data.doctor;
  return {
    title: `Dr. ${doctor?.name.split(" ")[0]}`,
    description: doctor?.doctorInfo?.bio,
    openGraph: {
      title: `Dr. ${doctor?.name.split(" ")[0]}`,
      description: doctor?.doctorInfo?.bio,
      images: [doctor?.image, ...previousImages],
    },
  };
}

const DoctorProfile = async ({ params }: DoctorProfileProps) => {
  const data = await fetchDoctorData(params.id);
  if (data?.statusCode === 404) {
    notFound();
  }
  if (data?.status === "fail") {
    throw new Error(data?.message, { cause: data?.message });
  }
  if ("data" in data) {
    const { doctor, availability } = data?.data;
    return (
      <section className="min-h-[calc(100dvh_-_4rem)] mb-10">
        <div className="grid lg:grid-cols-[300px_1fr] h-full gap-6">
          <Suspense fallback={<DoctorProfileAsideSkeleton />}>
            <DoctorProfileAside doctor={doctor} />
          </Suspense>
          <div className="max-lg:px-8">
            <Tabs defaultValue="about" className="mt-4">
              <TabsList className="bg-transparent md:w-2/3 justify-between flex">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-transparent  data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none data-[state=active]:shadow-none"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="service"
                  className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none data-[state=active]:shadow-none"
                >
                  Book an Appointment
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none data-[state=active]:shadow-none"
                >
                  Patient Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="about">
                <AboutDoctor doctor={doctor} />
              </TabsContent>
              <TabsContent value="service">
                <ServiceDetails availability={availability} doctor={doctor} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    );
  }
};

export default DoctorProfile;
