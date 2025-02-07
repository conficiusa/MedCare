"use client";

import {
  Calendar,
  ChevronRight,
  ClipboardPlus,
  Currency,
  Settings2,
  Upload,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface itemsTypes {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}
const items: itemsTypes[] = [
  {
    title: "Manage Appointments",
    url: "#",
    icon: Calendar,
    isActive: true,
    items: [
      {
        title: "Appointments",
        url: "/dashboard/appointments",
      },
      {
        title: "Book Appointment",
        url: "/find-a-doctor",
      },
      {
        title: "Reschedule Appointment",
        url: "/dashboard/appointments/reschedule",
      },
      {
        title: "Lab Requests",
        url: "/dashboard/appointments/lab-requests",
      },
      {
        title: "Prescriptions",
        url: "/dashboard/appointments/prescriptions",
      },
    ],
  },
  {
    title: "Billing",
    url: "/dashboard/billing",
    icon: Currency,
    items: [
      {
        title: "Invoices",
        url: "/dashboard/billing/invoices",
      },
      {
        title: "Payments",
        url: "/dashboard/billing/payments",
      },
    ],
  },
  {
    title: "Manage Records",
    url: "/dashboard/records",
    icon: ClipboardPlus,
    items: [
      {
        title: "Uploaded Records",
        url: "/dashboard/records/uploaded",
      },
      {
        title: "Consultation Records",
        url: "/dashboard/records/consultation",
      },
      {
        title: "Prescription Records",
        url: "/dashboard/records/prescription",
      },
    ],
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings2,
    items: [
      {
        title: "Profile",
        url: "settings/profile",
      },
      {
        title: "Team",
        url: "#",
      },
      {
        title: "Billing",
        url: "#",
      },
      {
        title: "Limits",
        url: "#",
      },
    ],
  },
];
export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Appointments</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} className="text-[13px]">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        className="text-xs text-muted-foreground"
                      >
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
