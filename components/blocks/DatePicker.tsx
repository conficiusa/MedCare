"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  availableDates: Date[];
  onSelect: (date: Date) => void;
  selected?: Date;
}
const DatePicker = ({
  availableDates,
  onSelect,
  selected,
}: DatePickerProps) => {
  return (
    <div>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(date) => date && onSelect(date)}
        modifiers={{
          available: availableDates,
        }}
        modifiersClassNames={{
          available: "text-primary font-semibold",
        }}
        classNames={{
          head_row: "flex gap-6 mb-6",
          row: "flex w-full mt-2 mb-4 gap-6",
        }}
      />
    </div>
  );
};

export default DatePicker;
