"use client";
import * as React from "react";
import {  CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { PatientOnboardingSchema } from "@/lib/schema";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { Input } from "@/components/ui/input";
import SelectComponent from "@/components/blocks/selectComponent";
import { regions } from "@/lib/data";
import { Button } from "@/components/ui/button";
import validateStep from "@/hooks/validateStep";
import { Step } from "@/app/onboarding/patient/page";

interface OnboardingAddressProps {
  form: UseFormReturn<z.output<typeof PatientOnboardingSchema>>;
  currentStep: Step;
  steps: Step[];
  setCurrentStep: (step: Step) => void;
}
const OnboardingAddress = ({
  form,
  currentStep,
  steps,
  setCurrentStep,
}: OnboardingAddressProps) => {
  const handleNext = async () => {
    const isValid = await validateStep(form, [
      "region",
      "city",
      "digitalAddress",
      "street",
    ]);
    const currentIndex = steps.indexOf(currentStep);
    if (isValid) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };
  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">
          Location & Address
        </CardTitle>
      </CardHeader>
      <div className="grid gap-4">
        <SelectComponent
          name="region"
          label="Choose your region"
          placeholder="Select region"
          items={regions}
          control={form.control}
        />
        <FormBuilder control={form.control} name="city" label="City/Town">
          <Input type="text" placeholder="city" />
        </FormBuilder>
        <FormBuilder
          control={form.control}
          name="digitalAddress"
          label="Digital address"
        >
          <Input type="text" placeholder="digital address" />
        </FormBuilder>
        <FormBuilder control={form.control} name="street" label="Street name">
          <Input type="text" placeholder="street name" />
        </FormBuilder>
        <Button className="w-full mt-4" onClick={handleNext} type="button">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OnboardingAddress;
