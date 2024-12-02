"use client";

import {
  Calendar,
  ChevronRight,
  ClipboardPlus,
  Currency,
  Settings2,
  TrendingUp,
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
        url: "/doctor/dashboard/appointments",
      },
      {
        title: "Schedule",
        url: "/doctor/dashboard/schedule",
      },
    ],
  },
  {
    title: "Consultation Reports",
    url: "/doctor/dashboard/consultation-reports",
    icon: Currency,
    items: [
      {
        title: "Consultation Reports",
        url: "/doctor/dashboard/consultation-reports",
      },
      {
        title: "Prescription Reports",
        url: "/doctor/dashboard/prescription-reports",
      },
    ],
  },
  {
    title: "Analytics",
    url: "/doctor/dashboard/analytics",
    icon: TrendingUp,
    items: [
      {
        title: "Consultation Analytics",
        url: "/doctor/dashboard/analytics/consultation",
      },
      {
        title: "Revenue Analytics",
        url: "/doctor/dashboard/analytics/revenue",
      },
      {
        title: "Patient Analytics",
        url: "/doctor/dashboard/analytics/patient",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "profile",
        url: "#",
      },
      {
        title: "account",
        url: "#",
      },
      {
        title: "preferences",
        url: "#",
      },
      {
        title: "",
        url: "#",
      },
    ],
  },
];
export function DoctorSidebarMain() {
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
