import { IUser } from "@/lib/definitions";
import { formatCurrency } from "@/lib/utils";
import { Stethoscope } from "lucide-react";
import Image from "next/image";
import React from "react";

const DoctorProfileAside = ({ doctor }: { doctor: IUser }) => {
  return (
    <aside className="bg-muted/40 px-14 py-10 h-full min-h-[calc(100dvh_-_4rem)]">
      <div>
        <Image
          src={doctor?.image || "/user.jpg"}
          width={200}
          height={200}
          alt="the doctors' profile"
          className="aspect-[4/5] object-cover rounded-md"
        />
      </div>
      <div className="py-4">
        <p className="text-semibold">Dr. {doctor?.name}</p>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Stethoscope strokeWidth={1.8} className="w-4 h-4" />
          <span className="text-xs">
            {doctor?.doctorInfo?.specialties?.join(", ")}
          </span>
        </p>
        <p className="mt-4 text-sm font-medium">
           {formatCurrency(doctor?.doctorInfo?.rate ?? 0)}
        </p>
      </div>
    </aside>
  );
};

export default DoctorProfileAside;
