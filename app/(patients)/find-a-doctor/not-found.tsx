import { cn } from "@/lib/utils";
import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFound({
	className,
	search,
}: {
	className?: string;
	search?: string;
}) {
	return (
		<main
			className={cn(
				"flex h-full rounded-2xl bg-muted/10 min-h-[calc(100dvh_-_20rem)] flex-col items-center justify-center gap-2",
				className
			)}
		>
			{!search && <Frown className='w-10 text-muted-foreground' />}
			<h2 className='text-xl font-semibold'>No Doctors Available </h2>
			<p className='text-xs text-muted-foreground '>
				{search
					? `No doctors found for "${search}"`
					: "No doctors available for consultations at the moment, Come back later."}
			</p>
		</main>
	);
}
