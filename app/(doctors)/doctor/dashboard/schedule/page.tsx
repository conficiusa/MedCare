import { auth } from "@/auth";
import Schedule from "@/components/sections/doctorschedule";
import { fetchDoctorAvailibility } from "@/lib/queries";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Manage Schedule",
};
const Page = async () => {
  const authSession = await auth();
  if (!authSession) {
    return redirect("/sign-in");
  }
  const data = await fetchDoctorAvailibility(authSession?.user?.id as string);

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1>Failed to load data</h1>
      </div>
    );
  }
  return (
    <Suspense>
      <Schedule data={data} session={authSession} />
    </Suspense>
  );
};

export default Page;
