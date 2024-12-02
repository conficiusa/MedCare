import DocCardOnline from "@/components/blocks/DocCardOnline";
import { fetchDoctorCardData } from "@/lib/queries";
import React from "react";
import NotFound from "../not-found";

const Datacards = async () => {
  const data = await fetchDoctorCardData({
    filter: {
      "doctorInfo.verification": "approved",
    },
    limit: 100,
    sort: {
      "doctorInfo.rating": -1,
      "doctorInfo.rate": 1,
    },
  });

  if ("error" in data) {
    if (data?.statusCode === 404) {
      return <NotFound />;
    }
    return <div>{data.message}</div>;
  }
  return (
    <DocCardOnline className="shadow-sm border-[1px]" doctors={data?.data} />
  );
};

export default Datacards;
