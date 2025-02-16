import { auth, signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default async function UserDp() {
  const session = await auth();
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
      <DropdownMenuContent className="w-56" collisionPadding={20}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <Link href="/dashboard/appointments">
            <DropdownMenuItem>My Appointments</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>My Prescriptions</DropdownMenuItem>
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
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
            logout
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
