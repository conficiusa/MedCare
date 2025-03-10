"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchInputProps {
	label: string;
	containerClassName?: string;
	placeholder?: string;
}
const SearchInput = ({
	label,
	containerClassName,
	placeholder,
}: SearchInputProps) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const handleSearch = useDebouncedCallback((term: string) => {
		const params = new URLSearchParams(searchParams);
		if (term) {
			params.set("query", term);
		} else {
			params.delete("query");
		}
		replace(`${pathname}?${params.toString()}`);
	}, 300);

	return (
		<div className={cn("relative", containerClassName)}>
			<label htmlFor='search' className='sr-only'>
				{label}
			</label>
			<Input
				type='search'
				id='search'
				placeholder={placeholder}
				autoFocus={false}
				onChange={(e) => {
					handleSearch(e.target.value);
				}}
				defaultValue={searchParams.get("query")?.toString()}
			/>
		</div>
	);
};

export default SearchInput;
