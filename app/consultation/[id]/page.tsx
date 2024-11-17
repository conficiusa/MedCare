import { FetchAppointment, FetchAppointmentByRoomId } from "@/lib/queries";
import VideoCall from "./video";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface Room {
  sid: string;
  name: string;
  maxParticipants: number;
}

interface Params {
  id: string;
}
interface Bookingprops {
  params: Params;
}
const Consultation = async ({ params }: Bookingprops) => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  const data = await FetchAppointmentByRoomId(params?.id as string);

  if ("data" in data)
    return <VideoCall room={data?.data?.room as Room} session={session} />;
};

export default Consultation;
