"use client";

import * as React from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  is24Hour?: boolean;
  popoverLabel?: string;
}

export function TimePicker({
  date,
  setDate,
  is24Hour = false,
  popoverLabel = "Time",
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const minutes = date.getMinutes();
  const hours = is24Hour ? date.getHours() : date.getHours() % 12 || 12;
  const meridiem = date.getHours() >= 12 ? "PM" : "AM";

  const formatted = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !is24Hour,
  });

  const handleTimeChange = (
    newHours: number,
    newMinutes: number,
    newMeridiem?: "AM" | "PM"
  ) => {
    const updatedDate = new Date(date);
    let adjustedHours = newHours;

    if (!is24Hour) {
      if (newMeridiem === "PM" && newHours !== 12) {
        adjustedHours += 12;
      } else if (newMeridiem === "AM" && newHours === 12) {
        adjustedHours = 0;
      }
    }

    updatedDate.setHours(adjustedHours);
    updatedDate.setMinutes(newMinutes);
    setDate(updatedDate);
  };

  const incrementHours = () => {
    let newHours = (hours + 1) % (is24Hour ? 24 : 12);
    if (!is24Hour) {
      if (newHours === 0) newHours = 12; // Handle 12-hour format wrapping
      const newMeridiem =
        newHours === 12 ? (meridiem === "AM" ? "PM" : "AM") : meridiem;
      handleTimeChange(newHours, minutes, newMeridiem);
    } else {
      handleTimeChange(newHours, minutes);
    }
  };

  const decrementHours = () => {
    let newHours = (hours - 1 + (is24Hour ? 24 : 12)) % (is24Hour ? 24 : 12);
    if (!is24Hour) {
      if (newHours === 0) newHours = 12; // Handle 12-hour format wrapping
      const newMeridiem =
        newHours === 11 ? (meridiem === "AM" ? "PM" : "AM") : meridiem;
      handleTimeChange(newHours, minutes, newMeridiem);
    } else {
      handleTimeChange(newHours, minutes);
    }
  };
  const incrementMinutes = () => {
    let newMinutes = (minutes + 1) % 60;
    let newHours = hours;
    let newMeridiem = meridiem;

    if (newMinutes === 0) {
      // Handle hour increment when minutes wrap to 0
      newHours = (hours + 1) % (is24Hour ? 24 : 12);
      if (!is24Hour) {
        if (newHours === 0) newHours = 12; // Handle wrapping to 12-hour format
        if (newHours === 12) {
          // Toggle meridiem when crossing 12
          newMeridiem = meridiem === "AM" ? "PM" : "AM";
        }
      }
    }

    handleTimeChange(newHours, newMinutes, newMeridiem as "AM" | "PM");
  };

  const decrementMinutes = () => {
    let newMinutes = (minutes - 1 + 60) % 60;
    let newHours = hours;
    let newMeridiem = meridiem;

    if (newMinutes === 59) {
      // Handle hour decrement when minutes wrap to 59
      newHours = (hours - 1 + (is24Hour ? 24 : 12)) % (is24Hour ? 24 : 12);
      if (!is24Hour) {
        if (newHours === 0) newHours = 12; // Handle wrapping to 12-hour format
        if (newHours === 11) {
          // Toggle meridiem when crossing 12
          newMeridiem = meridiem === "AM" ? "PM" : "AM";
        }
      }
    }

    handleTimeChange(newHours, newMinutes, newMeridiem as "AM" | "PM");
  };

  const toggleMeridiem = () => {
    if (is24Hour) return;
    const newMeridiem = meridiem === "AM" ? "PM" : "AM";
    handleTimeChange(hours, minutes, newMeridiem);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "pl-2 pr-6 justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatted}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <div className="flex flex-col">
          <div className="flex justify-center text-2xl gap-4 px-2 py-3">
            <p className="uppercase text-xs text-muted-foreground px-2">
              {popoverLabel}
            </p>
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" onClick={incrementHours}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <div className="w-10 text-center tabular-nums">
                {hours.toString().padStart(2, "0")}
              </div>
              <Button variant="ghost" size="icon" onClick={decrementHours}>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center text-2xl">:</div>
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" onClick={incrementMinutes}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <div className="w-10 text-center tabular-nums">
                {minutes.toString().padStart(2, "0")}
              </div>
              <Button variant="ghost" size="icon" onClick={decrementMinutes}>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            {!is24Hour && (
              <div className="flex flex-col items-center justify-center">
                <Button
                  variant="ghost"
                  className="w-14"
                  onClick={toggleMeridiem}
                >
                  {meridiem}
                </Button>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
