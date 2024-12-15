import { Doctor } from "@/lib/definitions";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DoctorProfileAside = ({ doctor }: { doctor: Doctor }) => {
  return (
    <aside className="lg:bg-muted/40 lg:px-14 px-8 lg:py-10 pt-4 lg:h-full lg:min-h-[calc(100dvh)]">
      <div className="mb-6">
        <Link className="flex items-center gap-2" href={"/find-a-doctor"}>
          <ArrowLeft strokeWidth={1.8} className="w-4 h-4" />
          <span className="text-xs">Go back</span>
        </Link>
      </div>
      <div className="max-lg:flex gap-10">
        <div className="hidden lg:block">
          <Image
            src={doctor?.image || "/user.jpg"}
            width={200}
            height={200}
            alt="the doctors' profile"
            className="aspect-[4/5] object-cover rounded-md"
          />
        </div>
        <div className="max-lg:block hidden">
          <Image
            src={doctor?.image || "/user.jpg"}
            width={150}
            height={150}
            alt="the doctors' profile"
            className="aspect-square object-cover rounded-md"
          />
        </div>
        <div className="lg:py-4">
          <p className="text-semibold">Dr. {doctor?.name}</p>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Stethoscope strokeWidth={1.8} className="w-4 h-4" />
            <span className="text-xs">
              {doctor?.doctorInfo?.specialities?.join(", ")}
            </span>
          </p>
          <p className="mt-6 text-sm font-medium">
            {formatCurrency(doctor?.doctorInfo?.rate ?? 0)}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default DoctorProfileAside;
