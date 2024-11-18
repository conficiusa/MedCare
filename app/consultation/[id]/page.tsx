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

  const data = await FetchAppointmentByRoomId(params?.id as string);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-[100dvh] flex-col max:sm:px-4">
        <h1>Failed to load appointment</h1>
        <p className="text-sm">
          If you have a valid appointment yet the error persists, kindly{" "}
          <Link className="text-primary" href={"/contact"}>
            Contact us
          </Link>
        </p>
      </div>
    );
  }
  if ("data" in data)
    return <VideoCall room={data?.data?.room as Room} session={session} />;
  if (data?.status === "fail")
    return (
      <div className="flex justify-center items-center h-[100dvh] flex-col max:sm:px-4">
        <h1>{data?.message}</h1>
        <p className="text-sm">
          If you have a valid appointment yet the error persists, kindly{" "}
          <Link className="text-primary" href={"/contact"}>
            Contact us
          </Link>
        </p>
      </div>
    );
};

export default Consultation;
