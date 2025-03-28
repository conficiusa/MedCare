import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpcomingAppointment from "./upcoming";
import { Session } from "next-auth";
import { Suspense } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AppointmentsSkeleton from "@/components/skeletons/appointments-skeleton";
import PendingAppointment from "./pending";
import CompletedAppointment from "./completed";
import CancelledAppointment from "./cancelled";

const tabs = [
	{ value: "upcoming", label: "Upcoming Today" },
	{ value: "pending", label: "Pending" },
	{ value: "completed", label: "Completed" },
	{ value: "cancelled", label: "Cancelled" },
];

const AppointmentTabs = ({
	session,
	searchParams,
}: {
	session: Session;
	searchParams: { page: string };
}) => {
	return (
		<Tabs defaultValue='upcoming' className='w-full'>
			<div className='overflow-x-auto relative'>
				<ScrollArea>
					<div className='w-full relative h-10'>
						<TabsList className='bg-transparent space-x-6 absolute'>
							{tabs.map((tab) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className='data-[state=active]:bg-transparent focus-visible:ring-0 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none transition-none data-[state=active]:shadow-none'
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
					</div>
					<ScrollBar orientation='horizontal' className='invisible' />
				</ScrollArea>
			</div>
			<TabsContent value='upcoming'>
				<Suspense fallback={<AppointmentsSkeleton />}>
					<UpcomingAppointment session={session} searchParams={searchParams} />
				</Suspense>
			</TabsContent>
			<TabsContent value='pending'>
				<Suspense fallback={<AppointmentsSkeleton />}>
					<PendingAppointment session={session} searchParams={searchParams} />
				</Suspense>
			</TabsContent>
			<TabsContent value='completed'>
				<Suspense fallback={<AppointmentsSkeleton />}>
					<CompletedAppointment session={session} searchParams={searchParams} />
				</Suspense>
			</TabsContent>
			<TabsContent value='cancelled'>
				<Suspense fallback={<AppointmentsSkeleton />}>
					<CancelledAppointment session={session} searchParams={searchParams} />
				</Suspense>
			</TabsContent>
		</Tabs>
	);
};

export default AppointmentTabs;
