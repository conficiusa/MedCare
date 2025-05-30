"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { Fragment } from "react";

const navItems = [
  {
    icon: <Bell className="w-4 h-4 text-muted-foreground" />,
    label: "Notifications",
  },
  {
    icon: <CreditCard className="w-4 h-4 text-muted-foreground" />,
    label: "Billing",
  },
  {
    icon: <BadgeCheck className="w-4 h-4 text-muted-foreground" />,
    label: "Account",
  },
];
export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  const names = session?.user?.name?.split(" ");
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={session?.user?.thumbnail ?? undefined}
                  alt={session?.user?.name ?? " your profile avatar "}
                />
                <AvatarFallback className="rounded-lg">
                  {names?.[0] && names?.[1].charAt(0) ? names[0] + names[1].charAt(0) : ""}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {session?.user?.name}
                </span>
                <span className="truncate text-xs">{session?.user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session?.user?.thumbnail ?? undefined}
                    alt={session?.user?.name ?? ""}
                  />
                  <AvatarFallback className="rounded-lg">
                    {names?.[0] && names?.[1] ? names[0] + names[1] : ""}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session?.user?.name}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {navItems.map((item) => (
              <Fragment key={item.label}>
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex gap-2">
                    {item.icon}
                    {item?.label}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </Fragment>
            ))}
            <DropdownMenuItem className="flex gap-2">
              <LogOut className="text-muted-foreground w-4 h-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
