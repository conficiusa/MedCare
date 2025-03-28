import { auth } from "@/auth";
import { AppSidebar } from "@/components/blocks/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function Page({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session || !session.user || !session.user.id) {
		redirect("/sign-in");
	}
	if (session.user.role === "doctor") {
		redirect("/doctor/dashboard/appointments");
	}
	return (
		<div>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className='bg-background'>
					<header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
						<div className='flex items-center gap-2 px-4'>
							<SidebarTrigger className='-ml-1' />
							<Separator orientation='vertical' className='mr-2 h-4' />
						</div>
					</header>
					{children}
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
