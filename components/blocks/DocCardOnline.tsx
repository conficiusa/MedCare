import { CircleDot, MessageSquareDot, Stethoscope, Video } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { DoctorCard } from "@/lib/definitions";
import Ratings from "@/components/blocks/ratingStars";

const DocCardOnline = async ({
  className,
  doctors,
}: {
  className?: string;
  doctors: DoctorCard[];
  }) => {
  return (
    <>
      {doctors?.map((doctor) => (
        <div
          className={cn(
            "min-w-full  md:min-w-[15rem] max-w-full p-4 rounded-md max-sm:shadow-sm dark:bg-muted/30 bg-background",
            className
          )}
          key={doctor.id}
        >
          <div className="grid grid-cols-[auto_1fr] gap-4 w-full ">
            <div className="">
              <div className="w-14 h-14 rounded-full  border-[1px]">
                <Image
                  src={doctor?.thumbnail || "/user.jpg"}
                  width={100}
                  height={100}
                  alt="A medical doctor"
                  className="object-cover w-14 h-14 rounded-full aspect-square "
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 max-sm:px-10">
              <p className="flex items-center gap-1">
                <CircleDot className="w-2 h-2 text-green-500 animate-pulse" />
                <span className="text-[10px]">Online now</span>
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Dr. {doctor?.name}</p>
                <p className="flex items-start gap-1">
                  <Stethoscope className="w-3.5 h-3.5" strokeWidth={1.8} />
                  <span className="text-xs">
                    {doctor?.doctorInfo?.specialities?.join(", ")}
                  </span>
                </p>
              </div>

              {doctor?.doctorInfo?.rating && (
                <div className="flex items-center gap-2 text-sm">
                  <Ratings value={doctor?.doctorInfo?.rating} />
                  <span>{doctor?.doctorInfo?.rating}</span>
                </div>
              )}
              <p className="text-sm font-medium">
                Rate: {formatCurrency(doctor?.doctorInfo?.rate as number)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <Button className="" variant={"outline"} size={"sm"} asChild>
              <Link href={`/find-a-doctor/consult/${doctor.id}`}>Consult</Link>
            </Button>
            <Link
              href={`/find-a-doctor/${doctor.id}`}
              className="text-primary text-[12px] underline underline-offset-2"
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default DocCardOnline;
