"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Appointment, Doctor } from "@/lib/definitions";
import moment from "moment";
import { AvatarImage, Avatar } from "@/components/ui/avatar";
import { Stethoscope } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const Paymentdoctorcard = ({
  doctor,
  appointment,
}: {
  doctor: Doctor;
  appointment: Partial<Appointment>;
}) => {
  return (
    <div className="py-8">
      <Card className="bg-muted/30 md:max-w-sm ml-auto">
        <CardContent className=" p-8">
          <div className="flex flex-col gap-2 divide-y-2">
            <div>
              <p className="font-medium"> Online Consultation</p>
              <p className="text-sm text-muted-foreground">
                {moment(appointment?.timeSlot?.startTime).format(
                  "MMMM D, YYYY"
                )}{" "}
                <span className="ml-4">
                  {" "}
                  {moment(appointment?.timeSlot?.startTime).format(
                    "hh:mm A"
                  )} -{" "}
                  {moment(appointment?.timeSlot?.endTime).format("hh:mm A")}
                </span>
              </p>
            </div>
            <div className="flex py-4 gap-6">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={doctor.image}
                  alt="A medical doctor"
                  className="w-16 h-16 object-cover rounded-full"
                />
              </Avatar>
              <div className="flex-1">
                <p className="font-medium"> Dr. {doctor?.name}</p>
                <p className="text-xs font-light text-muted-foreground flex gap-1">
                  <Stethoscope strokeWidth={1} className="w-4 h-4" />
                  {doctor?.doctorInfo?.specialities?.join(", ")}
                </p>
              </div>
            </div>
            <div className="flex pt-4 font-light text-sm text-muted-foreground">
              <p className="flex-1">Price</p>{" "}
              <span>{formatCurrency(doctor?.doctorInfo?.rate as number)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Paymentdoctorcard;
