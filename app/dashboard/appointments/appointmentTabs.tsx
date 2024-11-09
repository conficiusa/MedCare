import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpcomingAppointment from "./upcoming";
import { Session } from "next-auth";
import { Suspense } from "react";

const tabs: {
  value: string;
  label: string;
}[] = [
  {
    value: "upcoming",
    label: "Upcoming Today",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];
const AppointmentTabs = ({ session }: { session: Session }) => {
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="bg-transparent space-x-5">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-transparent focus-visible:ring-0 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none data-[state=active]:shadow-none"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="upcoming">
        <Suspense fallback={<div>Loading...</div>}>
          <UpcomingAppointment session={session} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export default AppointmentTabs;
