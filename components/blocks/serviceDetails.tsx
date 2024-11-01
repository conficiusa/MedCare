"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import DatePicker from "@/components/blocks/DatePicker";
import { IAvailability } from "@/lib/definitions";
import AnimationWrapper from "@/components/wrappers/animationWrapper";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";

const ServiceDetails = ({
  availability,
  name,
}: {
  availability: IAvailability[];
  name: string;
}) => {
  const [date, setDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const availableDates = availability.map((item) => new Date(item.date));
  const [isPending, startTransition] = useTransition();
  const { push } = useRouter();
  const availableTimeSlots = useMemo(() => {
    if (date) {
      const selectedAvailability = availability.find(
        (item) => new Date(item.date).toDateString() === date.toDateString()
      );
      return selectedAvailability?.timeSlots;
    }
  }, [date, availability]);

  useEffect(() => {
    if (date) {
      setSelectedTime(undefined);
    }
  }, [date]);

  const handleBookNow = () => {
    startTransition(() => {
      if (date && selectedTime) {
        const query = new URLSearchParams({
          date: date?.toISOString(),
          time: selectedTime,
        }).toString();
        push(`/find-a-doctor/${availability[0]?.doctorId}/checkout?${query}`);
      }
    });
  };

  return (
    <div className="mt-8 grid md:grid-cols-[auto_1fr] md:gap-12 xl:gap-20">
      <div className="">
        <p className="uppercase text-xs text-muted-foreground px-2">
          Select Date
        </p>
        <DatePicker
          availableDates={availableDates}
          onSelect={setDate}
          selected={date}
        />
        <small>
          Available dates are highlighted in{" "}
          <span className="text-primary">green</span>
        </small>
      </div>
      <div className="flex flex-col max-lg:py-6 max-md:gap-8">
        <div className="flex-1">
          {date ? (
            <AnimationWrapper>
              <p className="uppercase text-xs text-muted-foreground ">
                Select Time
              </p>
              {availableTimeSlots ? (
                <AnimationWrapper className="space-y-5 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Available time slots for {moment(date).format("MMM Do YY")}
                  </p>
                  <div className="flex flex-wrap gap-5">
                    {availableTimeSlots.map((slot) => (
                      <Button
                        key={slot}
                        className="w-fit text-xs lg:min-w-40"
                        variant={selectedTime === slot ? "default" : "outline"}
                        size={"sm"}
                        onClick={() => {
                          if (selectedTime === slot) {
                            setSelectedTime(undefined);
                          } else {
                            setSelectedTime(slot);
                          }
                        }}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </AnimationWrapper>
              ) : (
                <AnimationWrapper className="font-medium text-sm space-y-4 mt-4">
                  <p>
                    Dr. {name} has no open slots for this date. Please select
                    another date.
                  </p>
                  <p className="flex items-center gap-1 text-muted-foreground">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    Available dates are highlighted in{" "}
                    <span className="text-primary">green</span>
                  </p>
                </AnimationWrapper>
              )}
            </AnimationWrapper>
          ) : (
            <p className="text-sm text-muted-foreground">
              select a date to view available slots
            </p>
          )}
        </div>
        {selectedTime && (
          <AnimationWrapper className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selected time and date{" "}
            </p>
            <div className="max-w-sm flex items-center px-4 py-6 bg-muted dark:bg-muted/40 rounded-md">
              <div className="flex flex-col flex-1">
                <p className="font-semibold">
                  {moment(date).format("MMMM D, YYYY")}
                </p>
                <p className="font-medium text-muted-foreground text-sm">
                  {selectedTime}
                </p>
              </div>
              <div>
                <Button onClick={handleBookNow} disabled={isPending}>
                  Book Now
                </Button>
              </div>
            </div>
          </AnimationWrapper>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
