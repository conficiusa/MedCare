import DocCardOnline from "@/components/blocks/DocCardOnline";
import { fetchDoctorCardData } from "@/lib/queries";
import React from "react";
import NotFound from "../not-found";

interface propTypes {
  query?: string;
  page?: string;
  show_all?: string;
}
const Datacards = async ({ searchParams }: { searchParams?: propTypes }) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const showall = Boolean(searchParams?.show_all) || false;

  const queryOptions = {
    filter: {
      "doctorInfo.verification": "approved",
    },
    limit: 10,
    sort: {
      "doctorInfo.rating": -1 as const,
      "doctorInfo.rate": 1 as const,
    },
  };
  const data = await fetchDoctorCardData(queryOptions, query, showall);

  if ("error" in data) {
    if (data?.statusCode === 404) {
      return <NotFound search={query} />;
    }
    return <div>{data.message}</div>;
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
      <DocCardOnline className="shadow-sm border-[1px]" doctors={data?.data} />
    </div>
  );
};

export default Datacards;
