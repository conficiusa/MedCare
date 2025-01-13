"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { onDoctorBoardingSchema3 } from "@/lib/schema";
import { FormBuilder } from "@/components/blocks/formBuilder";
import MultiSelector from "@/components/blocks/multipleSelector";
import { certifications, specializations } from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Step } from "@/components/blocks/onboardingDoctor";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { DoctorOnboardStepThree } from "@/lib/onboarding";
import { Doctor } from "@/lib/definitions";
import { UpdateSession } from "next-auth/react";
import { Session } from "next-auth";
import { getFilteredValues } from "@/lib/utils";

const DoctorOnboardingCredentials = ({
  currentStep,
  setCurrentStep,
  steps,
  user,
  update,
  session,
}: {
  currentStep: Step;
  steps: Step[];
  setCurrentStep: (step: Step) => void;
  user: Doctor;
  update: UpdateSession;
  session: Session;
  }) => {
  
 const form = useForm<z.output<typeof onDoctorBoardingSchema3>>({
   resolver: zodResolver(onDoctorBoardingSchema3),
   defaultValues: {
     bio: user?.doctorInfo?.bio ?? "",
     certifications: getFilteredValues(
       user?.doctorInfo?.certifications,
       certifications
     ),
     experience: Number(user?.doctorInfo?.experience) ?? undefined,
     license_number: user?.doctorInfo?.license_number ?? "",
     specialities: getFilteredValues(
       user?.doctorInfo?.specialities,
       specializations
     ),
     current_facility: user?.doctorInfo?.current_facility ?? "",
   },
 });
  
  const handleSubmit = async (
    data: z.output<typeof onDoctorBoardingSchema3>
  ) => {
    try {
      const res = await DoctorOnboardStepThree(data);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          const { data } = res;
          const { onboarding_level, doctorInfo } = data;
          await update({
            ...session,
            user: {
              ...session.user,
              onboarding_level,
              doctorInfo,
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
      console.error(error);
      toast.error(error.message);
    }
  };

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
        <CardHeader className="px-0">
          <CardTitle className="text-lg font-medium">
            Professional history
          </CardTitle>
          <CardDescription>
            The Information in this section will be used to verify your
            credentials as a medical doctor and also recommend patients to you.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            className="grid gap-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormBuilder
              name="license_number"
              label="License / Registration number"
            >
              <Input placeholder="Enter your registration" />
            </FormBuilder>
            <FormBuilder name="current_facility" label="Your current facility">
              <Input placeholder="Where do you currently work" />
            </FormBuilder>
            <FormBuilder
              name="experience"
              label="How long have you been a licensed Practitioner (Years)"
              message
            >
              <Input placeholder="experience level" type="number" />
            </FormBuilder>
            <MultiSelector
              defaultOptions={specializations}
              form={form}
              name="specialities"
              empty="No specialities"
              label="Choose your Specialities (Optional but recommended)"
              description="If your speciality is not in the dropdown. you can create you by typing it in"
              placeholder="Select Speciality"
              maxSelected={4}
              onMaxSelected={(maxlimit) => {
                toast.info(`you have reached the maximum limit of ${maxlimit}`);
              }}
            />
            <MultiSelector
              defaultOptions={certifications}
              form={form}
              name="certifications"
              empty="No certifications"
              label="Choose your certifications (Optional but recommended)"
              description="If you you have certifications not included in the list. you can type them in"
              placeholder="Choose your certifications"
              maxSelected={4}
              onMaxSelected={(maxlimit) => {
                toast.info(`you have reached the maximum limit of ${maxlimit}`);
              }}
            />
            <FormBuilder
              control={form.control}
              name="bio"
              label="Tell us about your self"
              description={`Tell us about us as a person, then Speak about your education experience and approach, this is the bio users see when the visit your page`}
            >
              <Textarea
                placeholder="additional relevant information about your self"
                maxLength={1000}
                rows={9}
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
    </motion.div>
  );
};

export default DoctorOnboardingCredentials;
