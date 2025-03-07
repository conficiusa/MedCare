import VideoCall from "./video";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import AblyRealtimeProvider from "@/components/wrappers/ablyProvider";
import { Appointment as AppointmentType } from "@/lib/definitions";
import { isValidObjectId } from "mongoose";
import { FetchAppointment } from "@/lib/queries";

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
  if (!isValidObjectId(params.id)) {
    notFound();
  }
  const appointmentData = await FetchAppointment(params.id);
  if (!appointmentData) {
    notFound();
  }
  if (appointmentData?.statusCode !== 200 || !("data" in appointmentData)) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-center px-2">
        <div>Error loading appointment data</div>
      </div>
    );
  }

  return (
    <AblyRealtimeProvider clientId={session?.user?.id as string}>
      <VideoCall
        appointmentId={params?.id}
        session={session}
        appointment={appointmentData?.data}
      />
    </AblyRealtimeProvider>
  );
};

export default Consultation;
