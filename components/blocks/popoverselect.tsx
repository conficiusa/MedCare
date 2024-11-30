import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface item {
  value: string;
  label: string;
}
const PopoverSelect = ({
  form,
  name,
  label,
  search,
  items,
  loading,
  placeholder,
  error,
  ...rest
}: {
  form: any;
  name: string;
  label: string;
  search: string;
  items: item[];
  loading: boolean;
  error: boolean;
  placeholder?: string;
  [key: string]: any;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: any) => (
        <FormItem {...rest}>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between max-w-full",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? items?.find((item: item) => item?.value === field.value)
                        ?.label
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-popover-content-width-same-as-its-trigger max-h-popover-content-width-same-as-its-trigger">
              <Command loop>
                <CommandInput placeholder={search} />
                <CommandEmpty>
                  {loading
                    ? "Loading..."
                    : error
                    ? `Error loading labs`
                    : `No laboratories found`}
                </CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {items?.map((item) => (
                      <CommandItem
                        key={item?.value}
                        onSelect={() => {
                          form.setValue(name, item?.value);
                          form.clearErrors(name);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item?.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />

                        {item?.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};

export default PopoverSelect;
