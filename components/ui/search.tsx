import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

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
  return (
    <div className={cn("relative", containerClassName)}>
      <label htmlFor="search" className="sr-only">
        {label}
      </label>
      <Input
        className="pr-16"
        type="search"
        id="search"
        placeholder={placeholder}
      />
      <Button size="icon" className="absolute right-0 top-0 w-14">
        <Search />
      </Button>
    </div>
  );
};

export default SearchInput;
