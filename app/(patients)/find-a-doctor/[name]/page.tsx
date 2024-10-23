import { Stethoscope } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutDoctor from "@/components/blocks/doctorsAbout";
import ServiceDetails from "@/components/blocks/serviceDetails";

interface Params {
  name: string;
}
interface DoctorProfileProps {
  params: Params;
}
const DoctorProfile = ({ params }: DoctorProfileProps) => {
  return (
    <section className="min-h-[calc(100dvh_-_8rem)]">
      <div className="grid grid-cols-[auto_1fr] h-full gap-6">
        <aside className="bg-muted px-14 py-10 h-full min-h-[calc(100dvh_-_8rem)]">
          <div>
            <Image
              src={"/profile.png"}
              width={200}
              height={200}
              alt="the doctors' profile"
            />
          </div>
          <div className="py-4">
            <p className="text-semibold">Afi Sitsofe</p>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Stethoscope strokeWidth={1.8} className="w-4 h-4" /> Primary Care
            </p>
            <p className="mt-4 text-medium">GHS50.00</p>
          </div>
        </aside>
        <div>
          <Tabs defaultValue="service" className="mt-4">
            <TabsList className="bg-transparent w-2/3 justify-between grid grid-cols-3">
              <TabsTrigger
                value="service"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none data-[state=active]:shadow-none"
              >
                Service Details
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="data-[state=active]:bg-transparent  data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none data-[state=active]:shadow-none"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none data-[state=active]:shadow-none"
              >
                Patient Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="service">
              <ServiceDetails />
            </TabsContent>
            <TabsContent value="about">
              <AboutDoctor />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default DoctorProfile;
