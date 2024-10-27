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
  return (
    <main className="min-h-[calc(100dvh_-_4rem)] container">
      <div className="grid grid-cols-2 gap-5 pt-4 md:p-10">
        <div>
          <CheckOutForm rate={doctor?.doctorInfo?.rate ?? 0} />
          {/* <Button onClick={handlePaystackPayment}>pay</Button> */}
        </div>
        <div>
          <Paymentdoctorcard doctor={doctor}  />
        </div>
      </div>
    </main>
  );
};

export default Booking;
