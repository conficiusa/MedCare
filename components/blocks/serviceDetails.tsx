import React from "react";
import DatePicker from "@/components/blocks/DatePicker";

const availableDates: Date[] = [
  new Date(2024, 8, 12),
  new Date(2024, 8, 17),
  new Date(2024, 8, 9),
  new Date(2024, 8, 10),
];
const ServiceDetails = () => {
  return (
    <div>
      <DatePicker availableDates={availableDates} />
    </div>
  );
};

export default ServiceDetails;
