"use client";
import * as React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { PatientOnboardingSchema } from "@/lib/schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import SelectComponent from "@/components/blocks/selectComponent";
import { PhoneInput } from "@/components/ui/phone-input";
import DatePickerForm from "@/components/blocks/dobpicker";
import MultiSelector from "@/components/blocks/multipleSelector";
import { languages } from "@/lib/data";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import validateStep from "@/hooks/validateStep";
import { Step } from "@/app/onboarding/patient/page";

const OnboardingUserProfile = ({
  form,
  session,
  steps,
  setCurrentStep,
  currentStep,
}: {
  form: UseFormReturn<z.output<typeof PatientOnboardingSchema>>;
  session: Session | null;
  currentStep: Step;
  steps: Step[];
  setCurrentStep: (step: Step) => void;
}) => {
  const handleNext = async () => {
    const isValid = await validateStep(form, [
      "languages",
      "gender",
      "phone",
      "dob",
    ]);
    const currentIndex = steps.indexOf(currentStep);
    if (isValid) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };
  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-opacity-90">
          Welcome Aboard! {session?.user?.name?.split(" ")[0]}
        </CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <MultiSelector
          defaultOptions={languages}
          form={form}
          name="languages"
          empty="No languages found"
          label="Select Languages Spoken"
          placeholder="What languages do you speak?"
          groupBy="group"
          maxSelected={4}
          onMaxSelected={(maxlimit) => {
            toast.info(`you have reached the maximum limit of ${maxlimit}`);
          }}
        />
        <SelectComponent
          name="gender"
          label="Select Your Gender"
          placeholder="Select Your Gender"
          items={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
          ]}
        />
        <FormBuilder name="phone" label="Enter your Contact ">
          <PhoneInput
            type="text"
            placeholder="Phone number"
            className="duration-300"
            defaultCountry="GH"
            international={false}
          />
        </FormBuilder>
        <DatePickerForm
          name="dob"
          control={form.control}
          label="Choose your date of birth"
        />
        <Button className="w-full mt-4" onClick={handleNext} type="button">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OnboardingUserProfile;
