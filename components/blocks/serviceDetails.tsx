"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import DatePicker from "@/components/blocks/DatePicker";
import AnimationWrapper from "@/components/wrappers/animationWrapper";
import { AlertCircle, Router } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Appointment, AvailabilityType, Doctor } from "@/lib/definitions";
import { CreateAppointment } from "@/lib/actions";
import { toast } from "sonner";
import { findTimeSlotBySlotId } from "@/lib/queries";

const ServiceDetails = ({
  availability,
  doctor,
}: {
  availability: AvailabilityType[];
  doctor: Doctor;
}) => {
  const [date, setDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<
    | {
        id: string;
        startTime: string;
        endTime: string;
      }
    | undefined
  >({
    id: "",
    startTime: "",
    endTime: "",
  });
  const availableDates = availability.map((item) => new Date(item.date));
  const [isPending, setIsPending] = useState<boolean>(false);
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

  // const handleBookNow = () => {
  //   startTransition(() => {
  //     if (date && selectedTime) {
  //       const query = new URLSearchParams({
  //         slotId: selectedTime?.id,
  //       }).toString();
  //       push(`/find-a-doctor/${availability[0]?.doctorId}/checkout?${query}`);
  //     }
  //   });
  // };

  const handleCreateAppointment = async () => {
    try {
      if (!date) {
        toast.error("Please select a date");
        return;
      }
      if (!selectedTime) {
        toast.error("Please select a time slot");
        return;
      }
      setIsPending(true);
      const timeslot = await findTimeSlotBySlotId(selectedTime?.id as string);
      if (!timeslot) {
        throw new Error("Time Slot not available, please select another slot");
      }
      if (timeslot.isBooked) {
        toast.error(
          "Time slot has been booked already. Please select another slot"
        );
        return;
      }
      const appointmentData: Partial<Appointment> = {
        doctor: {
          doctorId: doctor?.id,
        },
        date: date?.toISOString(),
        mode: "online",
        paid: false,
        status: "pending",
        timeSlot: {
          startTime: selectedTime?.startTime as string,
          endTime: selectedTime?.endTime as string,
          slotId: selectedTime?.id as string,
        },
        online_medium: "video",
      };
      const data = await CreateAppointment(appointmentData);
      if (data?.appointmentStatus === "success") {
        const query = new URLSearchParams({
          appointment: data?.appointment?.id || "",
        }).toString();
        push(`/find-a-doctor/${availability[0]?.doctorId}/checkout?${query}`);
      } else {
        throw new Error("Could not create appointment");
      }
    } catch (error: any) {
      toast.error("Could not create appointment", {
        description: error.message,
      });
    } finally {
      setIsPending(false);
    }
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
                        key={slot?.slotId}
                        className="w-fit text-xs lg:min-w-40"
                        disabled={
                          slot?.isBooked ||
                          moment().isAfter(
                            moment(slot?.startTime).add(30, "minutes")
                          )
                        }
                        variant={
                          selectedTime?.id === slot?.slotId
                            ? "default"
                            : "outline"
                        }
                        size={"sm"}
                        onClick={() => {
                          if (selectedTime?.id === slot?.slotId) {
                            setSelectedTime(undefined);
                          } else {
                            setSelectedTime({
                              id: slot?.slotId,
                              startTime: slot?.startTime,
                              endTime: slot?.endTime,
                            });
                          }
                        }}
                      >
                        {moment(slot?.startTime).format("hh:mm A")} -{" "}
                        {moment(slot?.endTime).format("hh:mm A")}
                      </Button>
                    ))}
                  </div>
                </AnimationWrapper>
              ) : (
                <AnimationWrapper className="font-medium text-sm space-y-4 mt-4">
                  <p>
                    Dr. {doctor?.name} has no open slots for this date. Please
                    select another date.
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
        {selectedTime?.id && (
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
                  {moment(selectedTime?.startTime).format("hh:mm A")} -{" "}
                  {moment(selectedTime?.endTime).format("hh:mm A")}
                </p>
              </div>
              <div>
                <Button onClick={handleCreateAppointment} disabled={isPending}>
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
