"use client";

import * as React from "react";

import { NavMain } from "@/components/blocks/nav-main";
import { NavUser } from "@/components/blocks/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DoctorSidebarMain } from "./mainNav";
import { useSession } from "next-auth/react";

// This is sample data.

export function DoctorDashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data } = useSession();
  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      {...props}
      className="pt-[75px] bg-muted dark:bg-muted/40"
    >
      <SidebarContent>
        <DoctorSidebarMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
