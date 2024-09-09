import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import SearchInput from "@/components/ui/search";

interface SidebarProps {
  children: React.ReactNode;
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

const Sidebar = ({ children }: SidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>MedCare Hub</SheetTitle>
          <SearchInput label="Search" placeholder="search" />
        </SheetHeader>
        <nav className="flex flex-col divide-y-[1px] text-sm mt-8">
          {SidebarLink.map((link, idx) => (
            <Link
              href={link.href}
              key={idx}
              className="py-3 flex items-center justify-between"
            >
              {link.label} {link.icon}
            </Link>
          ))}

          <Link
            href="/referral"
            className="py-3 flex items-center justify-between mt-8"
          >
            Refer a friend{" "}
            <sup className="bg-teal-100 text-primary p-[0.2rem] text-xs rounded">
              10% off
            </sup>
          </Link>
          <Link
            href={"/listings"}
            className="py-3 flex items-center justify-between"
          >
            List your practice{" "}
            <ChevronRight strokeWidth={1.8} className="w-4 h-4" />
          </Link>
        </nav>
        <nav className="flex flex-col mt-5 text-sm">
          <Link
            href={"/about"}
            className="py-3 flex items-center justify-between"
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
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
