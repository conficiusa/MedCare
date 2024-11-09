"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppointmentStatus } from "@/app/dashboard/appointments/page";

export function DropdownMenuCheckboxes({
  handleTabChange,
  activeTab,
}: {
  handleTabChange: (value: AppointmentStatus) => void;
  activeTab: AppointmentStatus;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appointment Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={activeTab === "upcoming"}
          onCheckedChange={() => handleTabChange("upcoming")}
        >
          Upcoming Today
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={activeTab === "pending"}
          onCheckedChange={() => handleTabChange("pending")}
        >
          Pending
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={activeTab === "past"}
          onCheckedChange={() => handleTabChange("past")}
        >
          Past
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={activeTab === "cancelled"}
          onCheckedChange={() => handleTabChange("cancelled")}
        >
          Cancelled
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
