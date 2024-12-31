import VideoCall from "./video";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ParticipantState from "./state";
import AblyRealtimeProvider from "@/components/wrappers/ablyProvider";

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

  return (
    <AblyRealtimeProvider clientId={session?.user?.id as string}>
      <ParticipantState
        clientId={session?.user?.id as string}
        appointmentId={params?.id}
      />
      <VideoCall appointmentId={params?.id} session={session} />
    </AblyRealtimeProvider>
  );
};

export default Consultation;
