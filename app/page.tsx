import ConsultationPreview from "@/components/sections/consultPreview";
import ReferFriend from "@/components/sections/referfriend";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/faq";
import SendMessage from "@/components/sections/sendMessage";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongoose";

export async function fetchLatestInvoices() {
  try {
    connectToDatabase();
    const data = await User.find();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}
const Home = async () => {
  const data = await fetchLatestInvoices();
  console.log(data);
  return (
    <div className="bg-gradient-to-b from-teal-50 min-h-screen container ">
      <Hero />
      <Services />
      <ConsultationPreview />
      <Testimonials />
      <ReferFriend />
      <Faq />
      <SendMessage />
    </div>
  );
};

export default Home;
