import SearchInput from "@/components/ui/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocCardOnline from "@/components/blocks/DocCardOnline";
import DocCardInPerson from "@/components/blocks/DocCardInPerson";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import CardOnlineSkeleton from "@/components/skeletons/onlineCardSkeleton";
import { DoctorCard } from "@/lib/definitions";
import { fetchDoctorCardData } from "@/lib/queries";
import { notFound } from "next/navigation";
import NotFound from "./not-found";

const specialities: string[] = [
  "Cardiology",
  "Dental",
  "Dermatology",
  "General Medicine",
  "Gynaecology",
  "Mental Health",
  "Nutrition and Diets",
  "Neurology",
  "Opthamology",
  "Pediatrics",
  "Urology",
  "Infectious Diseases",
];
const FindDoctor = async () => {
  const doctors: DoctorCard[] =
    (await fetchDoctorCardData({
      limit: 10,
      sort: { "doctorInfo.rating": -1, "doctorInfo.rate": 1 },
    }).catch((error: any) => {
      return [];
    })) || [];

  return (
    <section className="min-h-[calc(100dvh_-_8rem)] rounded-sm bg-muted dark:bg-background">
      <div className="p-10 max-sm:px-4 max-sm:py-6">
        <p className="text-sm mb-2">
          Find a healthcare professional based on the type of service, symptom
          or specialty
        </p>
        <SearchInput
          label="search doctor"
          containerClassName="md:w-3/5"
          placeholder="example: symptom - flu, cold; specialty - dermatology, mental health, primary care"
        />
        <Tabs defaultValue="online" className="mt-4">
          <TabsList className="bg-transparent">
            <TabsTrigger
              value="online"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none"
            >
              Online Consultation
            </TabsTrigger>
            <TabsTrigger
              value="in-person"
              className="data-[state=active]:bg-transparent focus-visible:ring-0 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none"
            >
              In-Person Visit
            </TabsTrigger>
          </TabsList>
          <TabsContent value="online" className="py-8">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
              <Suspense fallback={<CardOnlineSkeleton />}>
                <DocCardOnline
                  doctors={doctors}
                  className="shadow-sm border-[1px]"
                />
              </Suspense>
            </div>
          </TabsContent>
          <TabsContent value="in-person">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
              <Suspense fallback={<div>Loading...</div>}>
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-10">
          <Tabs defaultValue="specialities" className="mt-4">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="specialities"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none"
              >
                Specialities
              </TabsTrigger>
              <TabsTrigger
                value="symptoms"
                className="data-[state=active]:bg-transparent focus-visible:ring-0 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none"
              >
                Symptoms
              </TabsTrigger>
            </TabsList>
            <TabsContent value="specialities">
              <div className="flex items-center space-between gap-3 max-w-4xl flex-wrap">
                {specialities.map((item, index) => (
                  <Button
                    key={index}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    {item} <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="in-person">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
                <DocCardInPerson className="shadow-sm border-[1px]" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default FindDoctor;
