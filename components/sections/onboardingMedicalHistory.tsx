"use client";
import * as React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { PatientOnboardingSchema3 } from "@/lib/schema";
import { FormBuilder } from "@/components/blocks/formBuilder";
import MultiSelector from "@/components/blocks/multipleSelector";
import { conditions } from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Step } from "@/components/sections/onbaordingPatient";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Form } from "../ui/form";
import { UpdateSession } from "next-auth/react";
import { Session } from "next-auth";
import { Patient } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientOnboardStepThree } from "@/lib/onboardingPatientactions";

const OnBoardingMedicalHistory = ({
  steps,
  setCurrentStep,
  currentStep,
  user,
  update,
  session,
}: {
  currentStep: Step;
  steps: Step[];
  setCurrentStep: (step: Step) => void;
  user: Patient;
  session: Session;
  update: UpdateSession;
}) => {
  const form = useForm<z.output<typeof PatientOnboardingSchema3>>({
    resolver: zodResolver(PatientOnboardingSchema3),
    defaultValues: {
      medicalHistory: user?.patientInfo?.medicalHistory ?? "",

      conditions:
        user?.patientInfo?.conditions?.length &&
        user?.patientInfo?.conditions?.length > 0
          ? conditions.filter((con) =>
              user?.patientInfo?.conditions?.includes(con.value)
            )
          : [],
    },
  });

  const handleSubmit = async (
    data: z.output<typeof PatientOnboardingSchema3>
  ) => {
    try {
      
      const res = await PatientOnboardStepThree(data);
      console.log("")
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
      console.error(error)
      toast.error("something went wrong", {
        description:"check your connection and try again"
      });
    }
  };
  return (
    <div className="w-full">
      <CardHeader className="px-0">
        <CardTitle
          className={cn("text-base antialiased font-semibold text-opacity-90")}
        >
          Location & Address
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <MultiSelector
            defaultOptions={conditions}
            form={form}
            name="conditions"
            empty="No conditions found"
            label="Conditions that you have or had in recent times"
            description="This will help your clinician understand your medical history better (Optional)"
            placeholder="Select Conditions"
            maxSelected={6}
            onMaxSelected={(maxlimit) => {
              toast.info(`you have reached the maximum limit of ${maxlimit}`);
            }}
          />
          <FormBuilder
            control={form.control}
            name="medicalHistory"
            label="Additional Information"
            description={`We recommend you provide information about your blood group, allergies, weight, last recorded blood pressure, and any other relevant information about your medical history`}
          >
            <Textarea
              placeholder="additional relevant information about your medical history"
              maxLength={900}
              rows={8}
              className="resize-none"
            />
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

export default OnBoardingMedicalHistory;
