"use client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarCheck, ListFilter, Stethoscope } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AvailableToggle = () => {
  const [showavailable, setShowAvailable] = useState(true);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleToggle = useCallback(() => {
    setShowAvailable((prev) => !prev);
  }, [showavailable]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (!showavailable) {
      params.set("show_all", "true");
    } else {
      params.delete("show_all");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [showavailable, replace, searchParams, pathname]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <ListFilter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked={showavailable === true}
          onCheckedChange={handleToggle}
        >
          <CalendarCheck className="text-muted-foreground mr-2 w-4 h-4" />
          Only available doctors
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showavailable === false}
          onCheckedChange={handleToggle}
        >
          <Stethoscope className="text-muted-foreground mr-2 w-4 h-4" />
          All doctors
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvailableToggle;
