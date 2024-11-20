import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutDoctor from "@/components/blocks/doctorsAbout";
import ServiceDetails from "@/components/blocks/serviceDetails";
import { fetchDoctorData } from "@/lib/queries";
import { notFound } from "next/navigation";
import DoctorProfileAside from "@/components/blocks/doctorProfileAside";
import { Suspense } from "react";
import { DoctorProfileAsideSkeleton } from "@/components/skeletons/doctorProfileSkeletons";

interface Params {
  id: string;
}
interface DoctorProfileProps {
  params: Params;
}
const DoctorProfile = async ({ params }: DoctorProfileProps) => {
  const data = await fetchDoctorData(params.id);
  if (!data || !data.doctor) {
    notFound();
  }
  const { doctor, availability } = data;
  return (
    <section className="min-h-[calc(100dvh_-_4rem)] mb-10">
      <div className="grid lg:grid-cols-[300px_1fr] h-full gap-6">
        <Suspense fallback={<DoctorProfileAsideSkeleton />}>
          <DoctorProfileAside doctor={doctor} />
        </Suspense>
        <div className="max-lg:px-8">
          <Tabs defaultValue="about" className="mt-4">
            <TabsList className="bg-transparent md:w-2/3 justify-between grid grid-cols-3">
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
                Service Details
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
};

export default DoctorProfile;
