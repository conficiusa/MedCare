import ConsultationPreview from "@/components/sections/consultPreview";
import ReferFriend from "@/components/sections/referfriend";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/faq";
import SendMessage from "@/components/sections/sendMessage";

const Home = async () => {
  return (
    <div className="bg-gradient-to-b from-teal-50 min-h-[100dvh] container ">
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
