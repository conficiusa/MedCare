import React from "react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FormBuilderProps {
  name: string;
  label: string;
  children: React.ReactNode;
  description?: string | null;
  message?: boolean;
  control?: any;
  messageClassName?: string;
  descriptionClassName?: string;
  labelClassName?: string;
  [key: string]: any;
}

export const FormBuilder = ({
  name,
  label,
  children,
  description = null,
  message,
  control = undefined,
  messageClassName,
  descriptionClassName,
  labelClassName,
  ...rest
}: FormBuilderProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({
        field,
      }: {
        field: { value: any; onChange: any; onBlur: any };
      }) => (
        <FormItem {...rest}>
          <FormLabel htmlFor={name} className={cn("", labelClassName)}>
            {label}
          </FormLabel>
          <FormControl>
            {React.isValidElement(children) ? (
              React.cloneElement(children, field)
            ) : (
              <>{children}</>
            )}
          </FormControl>
          {message && <FormMessage className={cn("", messageClassName)} />}
          {description && (
            <FormDescription className={cn("", descriptionClassName)}>
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
};
