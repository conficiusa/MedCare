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
      <PopoverContent
        sideOffset={5}
        align="end"
        side="bottom"
        className="bg-muted"
      >
        <p className="text-sm py-3 font-medium  text-muted-foreground px-3">
          How do you want to use our platform?
        </p>
        <div className="flex flex-col  gap-4">
          <Link
            href="/sign-up/?role=patient"
            className="font-medium p-3 text-sm flex justify-between w-full items-center bg-background rounded-md shadow"
          >
            Join as a Client{" "}
            <ChevronRight className="w-4 h-4" strokeWidth={1.8} />
          </Link>
          <Link
            href="/sign-up/?role=doctor"
            className="font-medium p-3 text-sm flex justify-between w-full items-center bg-background rounded-md shadow"
          >
            Join as a Doctor{" "}
            <ChevronRight className="w-4 h-4" strokeWidth={1.8} />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SignUpPopover;
