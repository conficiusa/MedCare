"use client";
import { TimePicker } from "@/components/blocks/timepicker";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AvailabilityType, ITimeSlot, ReturnType } from "@/lib/definitions";
import moment from "moment";
import { createAvailability, DeepPartial, deleteSlot } from "@/lib/actions";
import { Session } from "next-auth";
import { toast } from "sonner";
import AnimationWrapper from "@/components/wrappers/animationWrapper";
import { useEffect, useState } from "react";

export default function Schedule({
  data,
  session,
}: {
  data: ReturnType;
  session: Session;
}) {
  const { state } = useSidebar();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  useEffect(() => {
    setStartTime(new Date());
    const initialEndTime = new Date();
    initialEndTime.setHours(initialEndTime.getHours() + 1);
    setEndTime(initialEndTime);
  }, []);
  const getTimeSlots = (availability: AvailabilityType[]) => {
    return availability.flatMap((availability) => availability.timeSlots);
  };

  useEffect(() => {
    if (startTime && selectedDate) {
      const updatedStartTime = new Date(selectedDate);
      updatedStartTime.setHours(startTime.getHours());
      updatedStartTime.setMinutes(startTime.getMinutes());
      setStartTime(updatedStartTime);
    }
    if (endTime && selectedDate) {
      const updatedEndTime = new Date(selectedDate);
      updatedEndTime.setHours(endTime.getHours());
      updatedEndTime.setMinutes(endTime.getMinutes());
      setEndTime(updatedEndTime);
    }
  }, [selectedDate]);

  const addSlot = async () => {
    const availability: DeepPartial<AvailabilityType> = {
      date: selectedDate?.toISOString(),
      doctorId: session?.user?.id,
      timeSlots: [
        {
          startTime: startTime?.toISOString(),
          endTime: endTime?.toISOString(),
        },
      ],
    };

    const response = await createAvailability(availability);
    return response;
  };

  return (
    <div className="container">
      <h3 className="text-xl font-semibold mb-6">Schedule Management</h3>
      <div
        className={cn(
          "grid grid-cols-1 gap-6",
          state !== "expanded" && "md:grid-cols-2",
          "lg:grid-cols-2 gap-8"
        )}
      >
        <div className="w-full">
          <p className="uppercase text-xs text-muted-foreground px-2 mb-4">
            Select Date
          </p>
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              disabled={(date) => date < new Date()}
              classNames={{
                months:
                  "flex w-full flex-col sm:flex-row space-y-6 sm:space-x-4 sm:space-y-0 flex-1",
                month: "space-y-6 w-full flex flex-col",
                table: "w-full h-full border-collapse space-y-3",
                head_row: "",
                row: "w-full mt-2",
              }}
            />
          </div>
        </div>
        {selectedDate && (
          <AnimationWrapper
            className={cn(
              "w-full",
              state !== "expanded" && "md:flex md:justify-end",
              "lg:flex lg:justify-end"
            )}
          >
            <div>
              <p className="uppercase text-xs text-muted-foreground px-2">
                Select Time
              </p>
              <div className="flex gap-5 mt-4 items-center mb-4 bg-muted dark:bg-card h-fit p-6 rounded-lg">
                <div className="grid gap-1">
                  <Label className="mb-1">Start Time</Label>
                  <TimePicker
                    date={startTime || new Date()}
                    setDate={setStartTime}
                    is24Hour={false}
                    popoverLabel="Select start time"
                  />
                </div>
                <span className="-mb-4">-</span>
                <div className="grid gap-1">
                  <Label className="mb-1">End Time</Label>
                  <TimePicker
                    date={endTime || new Date()}
                    setDate={setEndTime}
                    is24Hour={false}
                    popoverLabel="Select end time"
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() =>
                  toast.promise(addSlot, {
                    loading: "creating slot...",
                    success: (data) => {
                      if (data?.status === "success") {
                        return data?.message;
                      }
                      throw new Error(data?.message);
                    },
                    error: (error) => error?.message,
                  })
                }
              >
                Add Slot
              </Button>
            </div>
          </AnimationWrapper>
        )}
      </div>
      <Card className="mt-14">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Open slots</CardTitle>
          <CardDescription>
            These are the slots available for patients to book appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.status === "fail" ? (
            <div className="w-full h-24 flex items-center justify-center mb-6">
              <p className="text-center text-muted-foreground">
                {data?.message}
              </p>
            </div>
          ) : (
            "data" in data && (
              <ul className="space-y-4">
                {getTimeSlots(data?.data)?.length > 0 ? (
                  getTimeSlots(data?.data).map((slot: ITimeSlot) => (
                    <li
                      key={slot?.slotId}
                      className="flex items-center justify-between bg-muted p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {moment(slot.startTime).format("MMM, D")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {moment(slot?.startTime).format("hh:mm a")} -{" "}
                          {moment(slot?.endTime).format("hh:mm a")}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant={"outline"} size={"icon"}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Deleting this slot will will prevent patients
                                from booking appointments during this time
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  const res = await deleteSlot(slot.slotId);

                                  if (!res || res?.status === "fail") {
                                    toast.error(
                                      res?.message || "Failed to delete slot"
                                    );
                                  }
                                }}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="w-full h-24 flex items-center justify-center mb-6">
                    <p className="text-center text-muted-foreground">
                      No slots available
                    </p>
                  </div>
                )}
              </ul>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
