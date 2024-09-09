import SearchInput from "@/components/ui/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocCardOnline from "@/components/blocks/DocCardOnline";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import DocCardInPerson from "@/components/blocks/DocCardInPerson";

const ConsultationPreview = () => {
  return (
    <section className="bg-muted min-h-[500px] my-16 rounded-sm">
      <div className="p-10">
        <h4 className="font-semibold mb-6">
          Speak to a Healthcare Professional Today
        </h4>
        <p className="text-sm mb-2">
          Find a healthcare professional based on the type of service, symptom
          or specialty
        </p>
        <SearchInput label="Search" containerClassName="w-1/2" />
        <Tabs defaultValue="online" className="mt-4">
          <TabsList>
            <TabsTrigger
              value="online"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none"
            >
              Online Consultation
            </TabsTrigger>
            <TabsTrigger
              value="in-person"
              className="data-[state=active]:bg-transparent focus-visible:ring-0 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none"
            >
              In-Person Visit
            </TabsTrigger>
          </TabsList>
          <TabsContent value="online" className="max-w-6xl">
            <Link
              href="#"
              className="text-sm flex items-center gap-1 justify-end"
            >
              View all <ArrowRight strokeWidth={1.8} className="w-4 h-4" />
            </Link>
            <div className="grid overflow-x-hidden grid-flow-col auto-cols-[18rem] gap-4  [mask-image:linear-gradient(to_right,white_80%,transparent)] mt-6">
              <DocCardOnline />
              <DocCardOnline />
              <DocCardOnline />
              <DocCardOnline />
              <DocCardOnline />
              <DocCardOnline />
              <DocCardOnline />
              <DocCardOnline />
              <DocCardOnline />
              <DocCardOnline />
            </div>
          </TabsContent>
          <TabsContent value="in-person" className="max-w-6xl">
            <Link
              href="#"
              className="text-sm flex items-center gap-1 justify-end"
            >
              View all <ArrowRight strokeWidth={1.8} className="w-4 h-4" />
            </Link>
            <div className="grid overflow-x-hidden grid-flow-col auto-cols-[18rem] gap-4 mt-6">
              <DocCardInPerson />
              <DocCardInPerson />
              <DocCardInPerson />
              <DocCardInPerson />
              <DocCardInPerson />
              <DocCardInPerson />
              <DocCardInPerson />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ConsultationPreview;
