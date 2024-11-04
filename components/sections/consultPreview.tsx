import SearchInput from "@/components/ui/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocCardOnline from "@/components/blocks/DocCardOnline";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import DocCardInPerson from "@/components/blocks/DocCardInPerson";
import { DoctorCard } from "@/lib/definitions";
import { fetchDoctorCardData } from "@/lib/queries";
import NotFound from "@/app/(patients)/find-a-doctor/not-found";
import { Suspense } from "react";
import CardOnlineSkeleton from "@/components/skeletons/onlineCardSkeleton";

const ConsultationPreview = async () => {
  const doctors: DoctorCard[] =
    (await fetchDoctorCardData({
      limit: 4,
      sort: { "doctorInfo.rating": -1, "doctorInfo.rate": 1 },
    }).catch((error: any) => {
      console.error(error);
      return [];
    })) || [];

  if (doctors.length === 0) {
    return <NotFound />;
  }
  return (
    <section className="sm:bg-muted/30 min-h-[500px] my-16 rounded-sm ">
      <div className="sm:p-10">
        <h4 className="font-semibold mb-6">
          Speak to a Healthcare Professional Today
        </h4>
        <p className="text-sm mb-2">
          Find a healthcare professional based on the type of service, symptom
          or specialty
        </p>
        <SearchInput
          label="Search"
          containerClassName="w-full md:w-3/5"
          placeholder="example: symptom - flu, cold; specialty - dermatology, mental health, primary care"
        />
        <Tabs defaultValue="online" className="mt-4">
          <div className="flex justify-between">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="online"
                className="data-[state=active]:bg-transparent focus-visible:ring-0 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none data-[state=active]:shadow-none"
              >
                Online Consultation
              </TabsTrigger>
              <TabsTrigger
                value="in-person"
                className="data-[state=active]:bg-transparent focus-visible:ring-0 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none data-[state=active]:shadow-none"
              >
                In-Person Visit
              </TabsTrigger>
            </TabsList>
            <Link
              href="#"
              className="text-sm items-center gap-1 font-medium hidden lg:flex"
            >
              View all <ArrowRight strokeWidth={1.8} className="w-4 h-4" />
            </Link>
          </div>

          <TabsContent value="online" className="">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
              <Suspense fallback={<CardOnlineSkeleton />}>
                <DocCardOnline
                  doctors={doctors}
                  className="shadow-sm border-[1px]"
                />
              </Suspense>
            </div>
          </TabsContent>
          <TabsContent value="in-person" className="max-w-6xl">
            <div className="grid overflow-x-hidden sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-10 mt-6">
              <DocCardInPerson />
              <DocCardInPerson />
              <DocCardInPerson />
              <DocCardInPerson />
              <DocCardInPerson />
              <DocCardInPerson />
              <DocCardInPerson />
            </div>
          </TabsContent>
          <Link
            href="#"
            className="text-sm hidden max-lg:flex items-center gap-1 justify-end mt-4 font-semibold"
          >
            View all <ArrowRight strokeWidth={1.8} className="w-4 h-4" />
          </Link>
        </Tabs>
      </div>
    </section>
  );
};

export default ConsultationPreview;
