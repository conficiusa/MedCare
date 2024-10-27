import CheckOutForm from "@/components/blocks/checkOutForm";
import { fetchDoctorData } from "@/lib/queries";

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
        <div></div>
      </div>
    </main>
  );
};

export default Booking;
