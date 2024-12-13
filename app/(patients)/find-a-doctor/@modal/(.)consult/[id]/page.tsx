import Modal from "@/components/blocks/modal";
import { fetchDoctorData } from "@/lib/queries";
import { notFound } from "next/navigation";
import React from "react";
import ScheduleAppointment from "./schedule";

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
    throw new Error(data?.message, { cause: data?.message });
  }
  if ("data" in data) {
    const { doctor, availability } = data?.data;
    return (
      <Modal>
        <ScheduleAppointment availability={availability} doctor={doctor} />
      </Modal>
    );
  }
};

export default BookAppointment;
