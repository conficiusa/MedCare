import { auth } from "@/auth";
import { fetchUserData } from "@/lib/queries";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const OnboardingDoctor = dynamic(
  () => import("@/components/blocks/onboardingDoctor"),
  {
    ssr: false,
  }
);
const Component = async () => {
  const authsession = await auth();
  if (!authsession) {
    redirect("/sign-in");
  }
  const user = await fetchUserData(authsession?.user?.id as string);
  if ("error" in user) {
    redirect("/sign-in");
  }
  return <OnboardingDoctor user={user?.data} />;
};

export default Component;
