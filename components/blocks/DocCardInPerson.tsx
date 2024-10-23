import { CircleDot, Stethoscope } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const DocCardInPerson = ({ className }: { className?: string }) => {
  return (
    <div>
      <div
        className={cn(
          "min-w-full md:min-w-[18rem] max-w-full p-4 rounded-md bg-white divide-y-[1px]  ",
          className
        )}
      >
        <div className="grid grid-cols-[auto_1fr] gap-4 w-full pb-4 ">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-[1px] bg-gray-100">
            <Image
              src="/sampleDoc.png"
              alt="A medical doctor"
              className="object-cover "
              width={64}
              height={64}
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className="flex items-center gap-1">
              <CircleDot className="w-2 h-2 text-green-500 animate-pulse" />
              <span className="text-[10px]">Online now</span>
            </p>
            <div>
              <p className="text-sm font-medium">Dr. Ellis Anderson, MD</p>
              <p className="flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5" strokeWidth={1.8} />
                <span className="text-xs"> Primary Care</span>
              </p>
            </div>
            <div>
              <Image
                width={80}
                height={50}
                className="object-cover w-auto h-auto"
                src="/rating.png"
                alt="rating stars"
              />
            </div>
            <p className="text-sm font-medium">Rate: GHS50.00</p>
          </div>
        </div>
        <div className="pt-3">
          <p className="text-xs pb-2">Today:</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Button className="" variant={"secondary"} size={"sm"}>
              9:00 am
            </Button>
            <Button className="" variant={"secondary"} size={"sm"}>
              3:00 pm
            </Button>
            <Button className="" variant={"secondary"} size={"sm"}>
              8:00 pm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocCardInPerson;
