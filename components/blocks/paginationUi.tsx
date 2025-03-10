"use client";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, ButtonProps } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentProps, ReactNode, useEffect } from "react";

type paginationUiProps = {
	totalPages: number;
};
export const PaginationUi = ({ totalPages }: paginationUiProps) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const currentPage = Number(searchParams.get("page")) || 1;
	const router = useRouter();

	const createPageURL = (pageNumber: number | string) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", pageNumber.toString());
		return `${pathname}?${params.toString()}`;
	};
	return (
		<Pagination>
			<PaginationContent>
				{currentPage > 1 && (
					<PaginationItem>
						<PaginationPrevious href={createPageURL(currentPage - 1)} />
					</PaginationItem>
				)}

				{[...Array(totalPages)].map((_, i) => {
					const pageNumber = i + 1;

					// Show first page, current page, last page, and one page before and after current
					if (
						pageNumber === 1 ||
						pageNumber === totalPages ||
						(pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
					) {
						return (
							<PaginationItem key={i}>
								<PaginationLink
									href={createPageURL(pageNumber)}
									isActive={pageNumber === currentPage}
								>
									{pageNumber}
								</PaginationLink>
							</PaginationItem>
						);
					}

					// Add ellipsis for breaks in sequence
					if (pageNumber === 2 || pageNumber === totalPages - 1) {
						return (
							<PaginationItem key={i}>
								<PaginationEllipsis />
							</PaginationItem>
						);
					}

					return null;
				})}

				{currentPage < totalPages && (
					<PaginationItem>
						<PaginationNext href={createPageURL(currentPage + 1)} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
};

type PaginationButtonProps = {
	onClick: () => void;
	isActive?: boolean;
	children: ReactNode;
} & Pick<ButtonProps, "size"> &
	ComponentProps<"button">;

const PaginationButton = ({
	onClick,
	size = "default",
	children,
	isActive,
	...props
}: PaginationButtonProps) => {
	return (
		<Button
			{...props}
			onClick={onClick}
			variant={isActive ? "outline" : "ghost"}
			className='gap-1 pl-2.5'
		>
			{children}
		</Button>
	);
};
