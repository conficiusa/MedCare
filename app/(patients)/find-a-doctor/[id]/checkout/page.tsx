import Paymentdoctorcard from "@/components/blocks/paymentdoctorcard";
import { fetchDoctorData } from "@/lib/queries";
import dynamic from "next/dynamic";
const CheckOutForm = dynamic(() => import("@/components/blocks/checkOutForm"), {
  ssr: false,
});

interface Params {
  id: string;
}
interface Bookingprops {
  params: Params;
}
const Booking = async ({ params }: Bookingprops) => {
  let { doctor } = await fetchDoctorData(params.id);
  doctor = JSON.parse(JSON.stringify(doctor));
  return (
    <main className="min-h-[calc(100dvh_-_4rem)] container max-md:mb-10">
      <div className="grid md:grid-cols-2 md:gap-10 gap-6 pt-4 md:p-6 lg:p-10">
        <div className="max-md:order-2">
          <CheckOutForm rate={doctor?.doctorInfo?.rate ?? 0} />
        </div>
        <div className="max-md:order-1">
          <Paymentdoctorcard doctor={doctor} />
        </div>
      </div>
    </main>
  );
};

export default Booking;
