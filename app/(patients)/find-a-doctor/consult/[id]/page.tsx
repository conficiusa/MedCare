import DoctorProfileAside from "@/components/blocks/doctorProfileAside";
import ServiceDetails from "@/components/blocks/serviceDetails";
import { fetchDoctorData } from "@/lib/queries";
import { notFound } from "next/navigation";
import React from "react";

interface Params {
  id: string;
}
interface DoctorProfileProps {
  params: Params;
}
const BookAppointment = async ({ params }: DoctorProfileProps) => {
const data = await fetchDoctorData(params.id);
  if (data?.statusCode === 404) {
    notFound();
  }
  if (data?.status === "fail") {
    throw new Error(data?.message,{cause:data?.message})
  }
  if ("data" in data) {
    const { doctor, availability } = data?.data;
    return (
      <section className="min-h-[calc(100dvh_-_4rem)] mb-10">
        <div className="grid lg:grid-cols-[300px_1fr] h-full gap-6">
          <DoctorProfileAside doctor={doctor} />
          <div className="max-lg:px-8">
            <ServiceDetails availability={availability} doctor={doctor} />
          </div>
        </div>
      </section>
    );
  }
};

export default BookAppointment;
