"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Session } from "next-auth";

interface SidebarProps {
  children: React.ReactNode;
  session: Session | null;
}
interface SidebarLink {
  href: string;
  label: string;
  icon: JSX.Element;
}
const SidebarLink: SidebarLink[] = [
  {
    href: "/find-a-doctor",
    label: "Consult a Doctor",
    icon: <ChevronRight strokeWidth={1.8} className="w-4 h-4" />,
  },
  {
    href: "/book-appointment",
    label: "Book an Appointment",
    icon: <ChevronRight strokeWidth={1.8} className="w-4 h-4" />,
  },
  {
    href: "/pharmacy",
    label: "Get Medication",
    icon: <ChevronRight strokeWidth={1.8} className="w-4 h-4" />,
  },
  {
    href: "/lab-test",
    label: "Schedule a Lab Test",
    icon: <ChevronRight strokeWidth={1.8} className="w-4 h-4" />,
  },
];

const Sidebar = ({ children, session }: SidebarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>MedCare Hub</SheetTitle>
          <SheetDescription className="sr-only">
            Main side bar for medcare
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-auto">
          <nav className="flex flex-col divide-y-[1px] text-sm mt-8">
            {SidebarLink.map((link, idx) => (
              <Link
                href={link.href}
                key={idx}
                className="py-3 flex items-center justify-between"
                onClick={() => setOpen(false)}
              >
                {link.label} {link.icon}
              </Link>
            ))}

            <Link
              href="/referral"
              className="py-3 flex items-center justify-between mt-8"
              onClick={() => setOpen(false)}
            >
              Refer a friend{" "}
              <sup className="bg-green-100 dark:bg-green-950 text-primary p-[0.2rem] text-xs rounded">
                10% off
              </sup>
            </Link>
            <Link
              href={"/listings"}
              className="py-3 flex items-center justify-between"
              onClick={() => setOpen(false)}
            >
              List your practice{" "}
              <ChevronRight strokeWidth={1.8} className="w-4 h-4" />
            </Link>
          </nav>
          <nav className="flex flex-col mt-3 text-sm">
            <Link
              href={"/about"}
              className="py-3 flex items-center justify-between"
              onClick={() => setOpen(false)}
            >
              About Us
            </Link>
            <Link
              href={"/contact"}
              className="py-3 flex items-center justify-between"
            >
              FAQ
            </Link>
          </nav>
          {!session && (
            <div className="hidden max-sm:flex mt-10 flex-col gap-2">
              <Link href={"/sign-in"} className="w-full">
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Join or Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
