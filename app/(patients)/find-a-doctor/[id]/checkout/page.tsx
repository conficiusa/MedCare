import Paymentdoctorcard from "@/components/blocks/paymentdoctorcard";
import { FetchAppointment, fetchUserData } from "@/lib/queries";
import dynamic from "next/dynamic";
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
  let [data, appointment] = await Promise.all([
    fetchUserData(params?.id),
    FetchAppointment(searchParams?.appointment),
  ]);
  if (data?.status === "fail" || appointment?.status === "fail") {
    
  }
  if ("data" in data && "data" in appointment) {
    const { data: doctor } = data;
    console.log(doctor);
    return (
      <main className="min-h-[calc(100dvh_-_4rem)] container max-md:mb-10">
        <div className="grid md:grid-cols-2 md:gap-10 gap-6 pt-4 md:p-6 lg:p-10">
          <div className="max-md:order-2">
            <CheckOutForm
              rate={100}
              id={appointment?.data?.id as string}
            />
          </div>
          <div className="max-md:order-1">
            <Paymentdoctorcard
              doctor={doctor}
              appointment={appointment?.data}
            />
          </div>
        </div>
      </main>
    );
  }
};

export default Booking;
