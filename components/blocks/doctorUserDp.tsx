"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LogOut } from "@/lib/actions";

export default function DoctorUserDp() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "";
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((name) => name[0])
    .join("");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
          <AvatarImage
            src={session?.user?.thumbnail ?? undefined}
            alt={userName}
          />
        </Avatar>
      </DropdownMenuTrigger>
      {session?.user?.doctorInfo?.verification !== "approved" ? (
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Make an enquiry</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <button
            onClick={async () => await LogOut()}
            className="relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent"
          >
            logout
          </button>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent className="w-56" collisionPadding={20}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <Link href="/doctor/dashboard/appointments">
              <DropdownMenuItem>Appointments</DropdownMenuItem>
            </Link>
            <Link href="/doctor/dashboard/schedule">
              <DropdownMenuItem>Manage Schedule</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Make a complain</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Privacy Policy</DropdownMenuItem>

            <DropdownMenuItem>Terms of Service</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <button
            onClick={async () => await LogOut()}
            className="relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent"
          >
            logout
          </button>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
