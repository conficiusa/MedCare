"use client";
import { CheckoutSchema } from "@/lib/schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormBuilderWithIcons } from "@/components/blocks/formBuilder";
import { AtSign, UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const CheckoutContactInfo = ({
  form,
}: {
  form: UseFormReturn<z.output<typeof CheckoutSchema>>;
}) => {
  return (
    <section>
      <p className="font-semibold">Contact information</p>
      <div className="grid gap-4 mt-6">
        <FormBuilderWithIcons
          name="fullName"
          label="Full Name"
          form={form}
          labelClassName="text-muted-foreground font-light"
          icon={<UserIcon />}
          required
        >
          <Input className="h-14 pl-10" disabled />
        </FormBuilderWithIcons>
        <FormBuilderWithIcons
          name="email"
          label="Email"
          form={form}
          labelClassName="text-muted-foreground font-light"
          icon={<AtSign />}
          description={
            "we will use this email to reach you about your appointment and send you a receipt"
          }
          descriptionClassName="font-light text-xs"
          required
        >
          <Input className="h-14 pl-10" disabled />
        </FormBuilderWithIcons>
      </div>
    </section>
  );
};

export default CheckoutContactInfo;
