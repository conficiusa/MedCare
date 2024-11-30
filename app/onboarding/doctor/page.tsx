import { auth } from "@/auth";
import DoctorOnboarding from "@/components/blocks/onboardingDoctor";
import { fetchUserData } from "@/lib/queries";
import { redirect } from "next/navigation";

const Component = async () => {
  const authsession = await auth();
  if (!authsession) {
    redirect("/sign-in");
  }
  const user = await fetchUserData(authsession?.user?.id as string);
  if ("error" in user) {
    redirect("/sign-in");
  }
  return <DoctorOnboarding user={user?.data} session={authsession} />;
};

export default Component;
