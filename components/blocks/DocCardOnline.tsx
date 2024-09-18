import { CircleDot, Stethoscope } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const DocCardOnline = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        " min-w-full md:min-w-[15rem] max-w-full p-4 rounded-md bg-white",
        className
      )}
    >
      <div className="grid grid-cols-[auto_1fr] gap-4 w-full ">
        <div className="">
          <div className="w-16 h-16 rounded-full  border-[1px]">
            <Image
              src="/sampleDoc.png"
              width={100}
              height={100}
              alt="A medical doctor"
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 max-sm:px-10">
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
            <img src="/rating.png" alt="rating stars" />
          </div>
          <p className="text-sm font-medium">Rate: GHS50.00</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <Button className="" variant={"outline"} size={"sm"}>
          Consult now
        </Button>
        <Link
          href={"#"}
          className="text-primary text-[12px] underline underline-offset-2"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default DocCardOnline;
