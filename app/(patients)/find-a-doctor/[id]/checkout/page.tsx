import Paymentdoctorcard from "@/components/blocks/paymentdoctorcard";
import { FetchAppointment, fetchDoctorData } from "@/lib/queries";
import dynamic from "next/dynamic";
import NotFound from "../not-found";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
const CheckOutForm = dynamic(() => import("@/components/blocks/checkOutForm"), {
  ssr: false,
});

interface Params {
  id: string;
}
interface SearchParams {
  appointment: string;
}
interface Bookingprops {
  params: Params;
  searchParams: SearchParams;
}
const Booking = async ({ params, searchParams }: Bookingprops) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  let data, appointment;
  try {
    [data, appointment] = await Promise.all([
      fetchDoctorData(params.id),
      FetchAppointment(searchParams?.appointment),
    ]);
  } catch (error) {
    console.error("Error fetching doctor data", error);
    return;
  }

  if (!data || !data.doctor) {
    return <NotFound />;
  }
  const { doctor } = data;

  if (!appointment?.data) {
    return <div>Appoitment not found</div>;
  }
  return (
    <main className="min-h-[calc(100dvh_-_4rem)] container max-md:mb-10">
      <div className="grid md:grid-cols-2 md:gap-10 gap-6 pt-4 md:p-6 lg:p-10">
        <div className="max-md:order-2">
          <CheckOutForm
            rate={doctor?.doctorInfo?.rate ?? 0}
            id={appointment?.data?.id as string}
          />
        </div>
        <div className="max-md:order-1">
          <Paymentdoctorcard doctor={doctor} appointment={appointment?.data} />
        </div>
      </div>
    </main>
  );
};

export default Booking;
