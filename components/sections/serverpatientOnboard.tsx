import { auth } from "@/auth";
import { fetchUserData } from "@/lib/queries";
import { redirect } from "next/navigation";
import PatientOnboarding from "./onbaordingPatient";

const ServerPatientOnboard = async () => {
  const authsession = await auth();
  if (!authsession) {
    redirect("/sign-in");
  }
  const user = await fetchUserData(authsession?.user?.id as string);
  if ("error" in user) {
    redirect("/sign-in");
  }
  return <PatientOnboarding user={user?.data} session={authsession} />;
};

export default ServerPatientOnboard;
