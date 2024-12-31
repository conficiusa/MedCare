import DoctorReviewDialog from "@/components/blocks/doctorReviewDialog";
import Modal from "@/components/blocks/modal";
import { FetchAppointment } from "@/lib/queries";
import React from "react";
interface Params {
  id: string;
}
interface ReviewProps {
  params: Params;
}
const Review = async ({ params }: ReviewProps) => {
  const data = await FetchAppointment(params?.id);
  if ("data" in data) {
    return (
      <Modal>
        <DoctorReviewDialog appointment={data.data} />
      </Modal>
    );
  }
};

export default Review;
