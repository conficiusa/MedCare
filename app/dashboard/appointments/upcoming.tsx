import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Appointment } from "@/lib/definitions";
import { fetchUserAppointments } from "@/lib/queries";
import { endOfDay, startOfDay } from "date-fns";
import {
  ChevronDown,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  Users,
  X,
  CheckCheckIcon,
  TimerReset,
  UploadCloud,
  HandHelping,
  Flag,
} from "lucide-react";
import moment from "moment";
import { Session } from "next-auth";
import Link from "next/link";

const today = new Date();

const UpcomingAppointment = async ({ session }: { session: Session }) => {
  const queryOptions = {
    filter: {
      date: {
        $gte: startOfDay(today),
        $lte: endOfDay(today),
      },
    },
    sort: { date: 1 as 1 | -1 },
  };

  const appointments = await fetchUserAppointments(
    session?.user?.id ?? "",
    queryOptions
  );
  if (!appointments) {
    return [];
  }

  if (appointments.length === 0) {
    return (
      <div>
        <h1>No appointments found</h1>
      </div>
    );
  }
  return (
    <div className="space-y-8 mt-8">
      {appointments?.map((appointment) => (
        <div
          key={appointment.id}
          className="flex  px-6 items-center border rounded-lg shadow-xl dark:shadow-lg dark:border-gray-700 dark:shadow-neutral-900"
        >
          <div className="text-center p-4 pl-0">
            <div className="text-sm text-muted-foreground">
              {moment(appointment.date).format("ddd")}
            </div>
            <div className="text-3xl font-semibold text-primary">
              {moment(appointment.date).format("D")}
            </div>
          </div>

          <Separator orientation="vertical" className="h-14" />
          <div className="flex-1 flex items-center p-4 space-x-4">
            <div className="space-y-1 min-w-[140px]">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {moment(appointment?.timeSlot?.startTime).format("hh:M A")}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>
                  {appointment?.mode},{" "}
                  {appointment?.mode === "online"
                    ? appointment?.online_medium
                    : undefined}
                </span>
              </div>
              <div className="text-xs text-muted-foreground pt-3">
                starting{" "}
                {appointment?.timeSlot.startTime
                  ? moment(appointment.timeSlot.startTime).fromNow()
                  : "No appointment time set"}{" "}
              </div>
            </div>
            <div className="flex-1 space-y-5">
              <div className="font-medium text-sm tracking-wide">
                {`${
                  appointment?.mode.charAt(0).toUpperCase() +
                  appointment.mode.slice(1)
                }  ${
                  appointment?.online_medium ?? undefined
                } consultation with`}{" "}
                <Link
                  className="text-primary"
                  href={`/find-a-doctor/${appointment?.doctor?.doctorId}`}
                >
                  Dr. {appointment?.doctor?.name}
                </Link>
              </div>
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
              <Button
                variant="outline"
                size="sm"
                aria-label="Appointment options"
              >
                Manage Appointment
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Appointment Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <CheckCheckIcon className="w-4 h-4 mr-2" />
                <span>Mark as completed</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TimerReset className="mr-2 h-4 w-4" />
                <span>Request reschedule</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UploadCloud className="mr-2 h-4 w-4" />
                <span>Upload Relevant Files</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Flag className="mr-2 h-4 w-4" />
                <span>Make a complaint</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HandHelping className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <X className="mr-2 h-4 w-4" />
                <span>Cancel appointment</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

export default UpcomingAppointment;
