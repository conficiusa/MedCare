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

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      {...props}
      className="pt-[75px] bg-muted dark:bg-muted/40ma"
    >
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
