import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Appointment } from "@/lib/definitions";
import {
  ChevronDown,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  Users,
  X,
} from "lucide-react";
import moment from "moment";
const UpcomingAppointment = ({
  appointments,
}: {
  appointments: Appointment[];
}) => {
  return (
    <div className="space-y-8 mt-8">
      {appointments?.map((appointment) => (
        <div
          key={appointment.id}
          className="flex  px-6 items-center border rounded-lg shadow-sm dark:shadow-lg dark:border-gray-700 dark:shadow-gray-950"
        >
          <div className="text-center p-4 pl-0">
            <div className="text-sm text-muted-foreground">
              {moment(appointment.date).format("ddd")}
            </div>
            <div className="text-3xl font-semibold text-primary">
              {moment(appointment.date).format("D")}
            </div>
          </div>

          <Separator orientation="vertical" className="h-12" />
          <div className="flex-1 flex items-center p-4 space-x-4">
            <div className="space-y-1 min-w-[140px]">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>
                  {appointment?.mode}{" "}
                  {appointment?.mode === "online"
                    ? appointment?.online_medium
                    : undefined}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-5">
              <div className="font-medium text-sm">{`${appointment?.mode}  ${
                appointment?.online_medium ?? undefined
              } consultation with Dr. ${appointment?.doctor.name}`}</div>
              <div className="flex -space-x-2 mt-1 items-center">
                <Avatar className=" h-10 w-10">
                  <AvatarImage
                    src={appointment?.patient.image}
                    alt={appointment?.patient.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-base">
                    {appointment?.patient.name
                      ?.split(" ")[0]
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={appointment?.doctor.image}
                    alt={appointment?.doctor.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-base">
                    {appointment?.doctor.name
                      ?.split(" ")[0]
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* {appointment.requestedTime && (
              <div className="text-xs text-orange-500 whitespace-nowrap">
                {appointment.requestedTime}
              </div>
            )} */}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Reschedule booking</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArrowRight className="mr-2 h-4 w-4" />
                <span>Request reschedule</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MapPin className="mr-2 h-4 w-4" />
                <span>Edit location</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Invite people</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <X className="mr-2 h-4 w-4" />
                <span>Cancel event</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

export default UpcomingAppointment;
