"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  availableDates: Date[];
}
const DatePicker = ({ availableDates }: DatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        modifiers={{
          available: availableDates,
        }}
        modifiersClassNames={{
          available: "text-primary font-semibold",
        }}
      />
    </div>
  );
};

export default DatePicker;
