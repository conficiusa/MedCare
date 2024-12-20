import ConsultationPreview from "@/components/sections/consultPreview";
import ReferFriend from "@/components/sections/referfriend";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/faq";
import SendMessage from "@/components/sections/sendMessage";
import Features from "@/components/sections/features";

const Home = async () => {
  return (
    <div className="min-h-[100dvh]">
      <Hero />
      <Features />
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
