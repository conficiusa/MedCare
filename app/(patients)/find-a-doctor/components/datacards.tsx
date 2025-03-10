import DocCardOnline from "@/components/blocks/DocCardOnline";
import { fetchDoctorCardData } from "@/lib/queries";
import React from "react";
import NotFound from "../not-found";
import { PaginationUi } from "@/components/blocks/paginationUi";

interface propTypes {
	query?: string;
	page?: string;
	show_all?: string;
}

const Datacards = async ({ searchParams }: { searchParams?: propTypes }) => {
	const query = searchParams?.query || "";
	const currentPage = Number(searchParams?.page) || 1;
	const showall = Boolean(searchParams?.show_all) || false;

	const ITEMS_PER_PAGE = 10;

	const queryOptions = {
		filter: {
			"doctorInfo.verification": "approved",
		},
		limit: ITEMS_PER_PAGE,
		page: currentPage,
		sort: {
			"doctorInfo.rating": -1 as const,
			"doctorInfo.rate": 1 as const,
		},
	};

	const data = await fetchDoctorCardData(queryOptions, query, showall);

	if ("error" in data) {
		if (data?.statusCode === 404) {
			return <NotFound search={query} />;
		}
		return <div>{data.message}</div>;
	}

	const totalDoctors = data.totalDoctors || 0;
	const totalPages = Math.ceil(totalDoctors / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
	const endIndex = Math.min(startIndex + ITEMS_PER_PAGE - 1, totalDoctors);

	return (
		<div className='flex flex-col gap-8'>
			{query && (
				<div className='text-sm text-muted-foreground'>
					Found {totalDoctors} {totalDoctors === 1 ? "doctor" : "doctors"}
					{query ? ` for "${query}"` : ""}
				</div>
			)}

			{!query && totalDoctors > 0 && (
				<div className='text-sm text-muted-foreground'>
					Showing {startIndex}-{endIndex} of {totalDoctors} doctors
				</div>
			)}

			<div className='grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6'>
				<DocCardOnline
					className='shadow-sm border-[1px]'
					doctors={data?.data}
				/>
			</div>

			{totalPages > 1 && <PaginationUi totalPages={totalPages} />}
		</div>
	);
};

export default Datacards;
