import { FetchAppointmentByRoomId } from "@/lib/queries";
import VideoCall from "./video";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  return <VideoCall appointmentId={params?.id} session={session} />;
};

export default Consultation;
