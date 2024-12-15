import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppointmentTabs from "./appointmentTabs";
import { Metadata } from "next";

export type AppointmentStatus = "upcoming" | "pending" | "past" | "cancelled";
export const metadata: Metadata = {
  title: "Appointments",
};
export default async function Component() {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div className="min-h-[calc(100dvh_-_4rem)] w-full px-4 md:px-8">
      <Card className="bg-background max-w-5xl mx-auto">
        <div className="space-y-4">
          <CardHeader className="space-y-1">
            <CardTitle className="md:font-semibold">My appointments</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              See and manage your scheduled appointments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <AppointmentTabs session={session} />
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
