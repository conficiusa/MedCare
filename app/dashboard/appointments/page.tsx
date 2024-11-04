import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UpcomingAppointment from "./upcoming";
import { fetchUserAppointments } from "@/lib/queries";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

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
export default async function Component() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }
  const appointments = await fetchUserAppointments(session?.user?.id ?? "");
  if (!appointments) {
    return [];
  }

  if (appointments.length === 0) {
    return (
      <div>
        <h1>No appointments found</h1>
      </div>
    );
  }
  return (
    <div className="min-h-[calc(100dvh_-_4rem)] w-full">
      <Card className="bg-background max-w-[90%] mx-auto">
        <div className="space-y-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">
              My appointments
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              See and manage your scheduled appointments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
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
                <UpcomingAppointment appointments={appointments} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
