"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import MultipleSelector, { Option } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

interface MultiSelectorProps {
  form: any;
  options?: Option[];
  defaultOptions?: Option[];
  name: string;
  empty?: React.ReactNode;
  placeholder?: string;
  label: string;
  rest?: MultiSelectorProps
  groupBy?: string;
  maxSelected?: number;
  description?: string;
  onMaxSelected?: (maxLimit: number) => void;
}
const MultiSelector = ({
  form,
  options,
  defaultOptions,
  name,
  empty,
  label,
  placeholder,
  groupBy,
  maxSelected,
  onMaxSelected,
  description,
  ...rest
}: MultiSelectorProps) => {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <MultipleSelector
                options={options}
                defaultOptions={defaultOptions}
                placeholder={placeholder}
                hidePlaceholderWhenSelected
                emptyIndicator={empty}
                className="z-30 bg-background"
                groupBy={groupBy}
                maxSelected={maxSelected}
                onMaxSelected={onMaxSelected}
              
                {...rest}
                {...field}
              />
              <ChevronsUpDown
                className={cn(
                  "z-50 absolute top-2.5 right-0 mr-2 h-4 w-4 shrink-0 opacity-50",
                  form.watch(name) && "-z-20"
                )}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};

export default MultiSelector;
