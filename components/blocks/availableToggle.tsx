"use client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { TooltipProvider } from "../ui/tooltip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarCheck, CalendarOff } from "lucide-react";
import { TooltipBuilder } from "./tooltipBuilder";

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
    <TooltipBuilder
      content={showavailable ? "Show all" : "Show  doctors with open slots"}
    >
      <Button size={"icon"} variant={"outline"} onClick={handleToggle}>
        {showavailable ? <CalendarOff /> : <CalendarCheck />}
      </Button>
    </TooltipBuilder>
  );
};

export default AvailableToggle;
