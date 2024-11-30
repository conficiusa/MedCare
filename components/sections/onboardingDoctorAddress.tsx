"use client";
import * as React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { onDoctorBoardingSchema2 } from "@/lib/schema";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { Input } from "@/components/ui/input";
import SelectComponent from "@/components/blocks/selectComponent";
import { regions } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Step } from "@/components/blocks/onboardingDoctor";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { DoctorOnboardStepTwo } from "@/lib/onboarding";
import { toast } from "sonner";
import { Doctor } from "@/lib/definitions";
import { UpdateSession } from "next-auth/react";
import { Session } from "next-auth";

interface OnboardingAddressProps {
  currentStep: Step;
  steps: Step[];
  setCurrentStep: (step: Step) => void;
  user: Doctor;
  update: UpdateSession;
  session: Session;
}
const OnboardingDoctorAddress = ({
  currentStep,
  steps,
  user,
  session,
  update,
  setCurrentStep,
}: OnboardingAddressProps) => {

  const form = useForm<z.output<typeof onDoctorBoardingSchema2>>({
    resolver: zodResolver(onDoctorBoardingSchema2),
    defaultValues: {
      address_1: user?.address_1 ?? "",
      address_2: user?.address_2 ?? "",
      city: user?.city ?? "",
      country: "ghana",
      region: user?.region ?? "",
    },
  });

  const handleSubmit = async (
    data: z.output<typeof onDoctorBoardingSchema2>
  ) => {
    try {
      const res = await DoctorOnboardStepTwo(data);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          await update({
            ...session,
            user: {
              ...session.user,
              address_2: res?.data?.address_2,
              address_1: res?.data?.address_1,
              city: res?.data?.city,
              country: res?.data?.country,
              region: res?.data?.region,
              onboarding_level: res?.data?.onboarding_level,
              doctorInfo: {
                ...session?.user?.doctorInfo,
                onboarding_level: res?.data?.doctorInfo?.onboarding_level,
              },
            },
          });
          const currentIndex = steps.indexOf(currentStep);
          setCurrentStep(steps[currentIndex + 1]);
        }
      } else {
        toast.success("Failed", {
          description: "If the error persist contact us",
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="w-full">
      <CardHeader className="px-0">
        <CardTitle
          className={cn("text-base antialiased font-semibold text-opacity-90")}
        >
          Welcome Aboard!
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
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
            name="address_1"
            label="Address 1"
          >
            <Input type="text" placeholder="address" />
          </FormBuilder>
          <FormBuilder
            control={form.control}
            name="address_2"
            label="Address 2"
          >
            <Input type="text" placeholder="address" />
          </FormBuilder>

          <Button
            className="w-full mt-4"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OnboardingDoctorAddress;
