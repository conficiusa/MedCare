import { auth } from "@/auth";
import ConsultationReport from "./reportForm";
import { notFound, redirect } from "next/navigation";
import { FetchAppointment, fetchUserData } from "@/lib/queries";
import { isValidObjectId } from "mongoose";
import { LockIcon } from "lucide-react";

interface Params {
  id: string;
}
interface Reportprops {
  params: Params;
}
const Page = async ({ params }: Reportprops) => {
  const session = await auth();
  /**
   * If the user is not authenticated, redirect to the sign-in page
   */

  if (!session || !session.user) {
    redirect("/sign-in");
  }
  if (!params.id) {
    notFound();
  }
  if (!isValidObjectId(params.id)) {
    notFound();
  }

  const appointmentData = await FetchAppointment(params.id);
  if (!appointmentData) {
    redirect("/404");
  }
  if (appointmentData?.statusCode !== 200 || !("data" in appointmentData)) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-center px-2">
        <div>{appointmentData?.message}</div>
      </div>
    );
  }
  if (
    appointmentData.data.doctor.doctorId.trim() !== session?.user?.id?.trim()
  ) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-center px-2 gap-3">
        <LockIcon />
        <div>You are not authorized to view this page</div>
      </div>
    );
  }
  const patient = await fetchUserData(appointmentData.data.patient.patientId, [
    "dob",
    "name",
  ]);
  if (patient?.statusCode !== 200 || !("data" in patient)) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-center px-2">
        <div>{patient.message}</div>
      </div>
    );
  }
  if (
    appointmentData.data.patient.patientId.trim() !== patient.data.id?.trim()
  ) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-center px-2 gap-3">
        <LockIcon />
        <div>You have to access to this user&apos;s records</div>
      </div>
    );
  }
  return (
    <ConsultationReport
      appointment={appointmentData.data}
      user={patient.data}
    />
  );
};

export default Page;
