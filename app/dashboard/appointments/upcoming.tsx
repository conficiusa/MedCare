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
import { fetchUserAppointments } from "@/lib/queries";
import {
  ChevronDown,
  Clock,
  MapPin,
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

const UpcomingAppointment = async ({ session }: { session: Session }) => {
  const queryOptions = {
    filter: {},
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
      {appointments.map((appointment, index) => (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out">
          <div className="text-center p-4 sm:p-6 border-b sm:border-b-0 sm:border-r w-full sm:w-24">
            <div className="text-sm font-medium text-muted-foreground">
              {moment(appointment.date).format("ddd")}
            </div>
            <div className="text-3xl font-bold text-primary">
              {moment(appointment.date).format("D")}
            </div>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="space-y-1 w-full sm:w-auto sm:min-w-[140px]">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>
                  {moment(appointment?.timeSlot?.startTime).format("h:mm A")} -{" "}
                  {moment(appointment?.timeSlot?.endTime).format("h:mm A")}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{appointment?.mode}</span>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="font-medium text-sm mb-1">
                {appointment?.mode} Consultation with Dr.{" "}
                <Link href={`/find-a-doctor/${appointment?.doctor?.doctorId}`}>
                  {appointment?.doctor?.name} at{" "}
                  {moment(appointment.date).format("h:mm A")}
                </Link>
              </div>
              <div className="flex -space-x-1">
                <Avatar className="border-2  h-8 w-8 transition-transform hover:scale-110">
                  <AvatarImage
                    src={appointment.patient.image}
                    alt={appointment.patient.name}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {appointment.patient.name?.split(" ")[0]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Avatar className="border-2  h-8 w-8 transition-transform hover:scale-110">
                  <AvatarImage
                    src={appointment?.doctor?.image}
                    alt={appointment?.doctor?.name}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {appointment?.doctor?.name?.split(" ")[0]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* {appointment.requestedTime && (
              <div className="text-xs font-medium text-orange-500 bg-orange-100 px-2 py-1 rounded-full whitespace-nowrap mt-2 sm:mt-0">
                {appointment.requestedTime}
              </div>
            )} */}
          </div>

          <div className="p-4 sm:p-6">
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
        </div>
      ))}
    </div>
  );
};

export default UpcomingAppointment;
