"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { PatientOnboardingSchema } from "@/lib/schema";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { Input } from "@/components/ui/input";
import SelectComponent from "@/components/blocks/selectComponent";
import { regions } from "@/lib/data";

interface OnboardingAddressProps {
  form: UseFormReturn<z.output<typeof PatientOnboardingSchema>>;
}
const OnboardingAddress = ({ form }: OnboardingAddressProps) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row items-center gap-8"
    >
      <div className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Location & Address
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SelectComponent
            name="region"
            label="Choose your region"
            placeholder="Select region"
            items={regions}
            control={form.control}
          />
          <FormBuilder
            control={form.control}
            name="city"
            label="City/Town"
          >
            <Input type="text" placeholder="city" />
          </FormBuilder>
          <FormBuilder
            control={form.control}
            name="digitalAddress"
            label="Digital address"
          >
            <Input type="text" placeholder="digital address" />
          </FormBuilder>
          <FormBuilder
            control={form.control}
            name="street"
            label="Street name"
          >
            <Input type="text" placeholder="street name" />
          </FormBuilder>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default OnboardingAddress;
