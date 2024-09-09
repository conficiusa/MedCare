import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SignUpPopoverProps {
  children: React.ReactNode;
}
const SignUpPopover = ({ children }: SignUpPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={5} align="end" side="bottom">
        <p className="text-sm py-3 font-medium">Sign up as a:</p>
        <div className="flex flex-col divide-y-[1px]">
          <Link
            href="/signup/?role=patient"
            className="py-2 text-sm flex justify-between w-full items-center"
          >
            Patient <ChevronRight className="w-4 h-4" strokeWidth={1.8} />
          </Link>
          <Link
            href="/signup/?role=doctor"
            className="py-2 text-sm flex justify-between w-full items-center"
          >
            Doctor <ChevronRight className="w-4 h-4" strokeWidth={1.8} />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SignUpPopover;
