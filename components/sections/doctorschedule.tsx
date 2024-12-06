"use client";
import { TimePicker } from "@/components/blocks/timepicker";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface Availability {
  id: string;
  date: Date;
  start: Date;
  end: Date;
}

export default function Schedule() {
  const { state } = useSidebar();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [startTime, setStartTime] = React.useState<Date>(new Date());
  const [endTime, setEndTime] = React.useState<Date>(new Date());
  const [availabilities, setAvailabilities] = React.useState<Availability[]>(
    []
  );
  const [editingAvailability, setEditingAvailability] =
    React.useState<Availability | null>(null);

  console.log(selectedDate);
  console.log(startTime);
  const handleAddAvailability = () => {
    if (selectedDate) {
      const newAvailability: Availability = {
        id: Date.now().toString(),
        date: selectedDate,
        start: startTime,
        end: endTime,
      };
      setAvailabilities([...availabilities, newAvailability]);
    }
  };

  const handleEditAvailability = (availability: Availability) => {
    setEditingAvailability(availability);
    setSelectedDate(availability.date);
    setStartTime(availability.start);
    setEndTime(availability.end);
  };

  const handleUpdateAvailability = () => {
    if (editingAvailability && selectedDate) {
      const updatedAvailabilities = availabilities.map((a) =>
        a.id === editingAvailability.id
          ? { ...a, date: selectedDate, start: startTime, end: endTime }
          : a
      );
      setAvailabilities(updatedAvailabilities);
      setEditingAvailability(null);
    }
  };

  const handleDeleteAvailability = (id: string) => {
    setAvailabilities(availabilities.filter((a) => a.id !== id));
  };

  return (
    <div className="container">
      <h3 className="text-xl font-medium mb-6">
        Add openings to your schedule
      </h3>
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
        <div
          className={cn(
            "w-full",
            state !== "expanded" && "md:flex md:justify-end",
            "lg:flex lg:justify-end"
          )}
        >
          <div>
            <p className="uppercase text-xs text-muted-foreground px-2">
              {editingAvailability ? "Update slot" : "Select Time"}
            </p>
            <div className="flex gap-5 mt-4 items-center mb-4">
              <div className="grid gap-1">
                <Label className="mb-1">Start Time</Label>
                <TimePicker
                  date={startTime}
                  setDate={setStartTime}
                  is24Hour={false}
                  popoverLabel="Select start time"
                />
              </div>
              <span className="-mb-4">-</span>
              <div className="grid gap-1">
                <Label className="mb-1">End Time</Label>
                <TimePicker
                  date={endTime}
                  setDate={setEndTime}
                  is24Hour={false}
                  popoverLabel="Select end time"
                />
              </div>
            </div>
            {editingAvailability ? (
              <div className="flex space-x-2">
                <Button onClick={handleUpdateAvailability} className="flex-1">
                  Update Slot
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingAvailability(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={handleAddAvailability} className="w-full">
                Add Slot
              </Button>
            )}
          </div>
        </div>
      </div>
      <Card className="mt-14">
        <CardHeader>
          <CardTitle>Open slots</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {availabilities.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No open slots set
              </p>
            ) : (
              <ul className="space-y-4">
                {availabilities.map((availability) => (
                  <li
                    key={availability.id}
                    className="flex items-center justify-between bg-muted p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {availability.date.toDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {availability.start.toLocaleTimeString()} -{" "}
                        {availability.end.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditAvailability(availability)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Are you sure you want to delete this slot?
                            </DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => {}}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleDeleteAvailability(availability.id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
