import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectComponentProps {
  items: { value: string; label: string }[];
  placeholder: string;
  name: string;
  control?: any;
  label: string;
  message?: boolean | null;
  description?: string | null;
  empty?: string;
  [key: string]: any;
}

export default function SelectComponent({
  items,
  placeholder,
  name,
  control,
  label,
  message = null,
  description = null,
  empty,
  ...rest
}: SelectComponentProps) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem {...rest}>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "text-muted-foreground",
                  field?.value && "text-black dark:text-white"
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items?.length > 0 ? (
                items?.map((item, index) => (
                  <SelectItem value={item.value} key={index}>
                    {item.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem className="whitespace-wrap" value="">
                  {empty || "no items to choose from"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {message && <FormMessage />}
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}
