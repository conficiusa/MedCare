import DocCardOnline from "@/components/blocks/DocCardOnline";
import CardOnlineSkeleton from "@/components/skeletons/onlineCardSkeleton";
import { TabsContent } from "@/components/ui/tabs";
import { DoctorCard } from "@/lib/definitions";
import { fetchDoctorCardData } from "@/lib/queries";
import React, { Suspense } from "react";
import NotFound from "../not-found";

const Datacards = async () => {
  const doctors: DoctorCard[] | "error" =
    (await fetchDoctorCardData({
      limit: 10,
      sort: { "doctorInfo.rating": -1, "doctorInfo.rate": 1 },
    }).catch((error: any) => {
      console.log("error", error);
      return "error";
    })) || [];

  if (!Array.isArray(doctors)) {
    return <div>Failed to load</div>;
  }

  if (doctors?.length === 0) {
    return <NotFound className="min-h-[300px]" />;
  }
  return (
    <TabsContent value="online" className="py-8">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
        <DocCardOnline className="shadow-sm border-[1px]" doctors={doctors} />
      </div>
    </TabsContent>
  );
};

export default Datacards;
