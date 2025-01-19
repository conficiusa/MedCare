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
import { Paperclip } from "lucide-react";
import { UpdateSession } from "next-auth/react";
import { Session } from "next-auth";
import { getFilteredValues } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
      experience: user?.doctorInfo?.experience
        ? Number(user?.doctorInfo?.experience)
        : undefined,
      license_number: user?.doctorInfo?.license_number ?? "",
      specialities: getFilteredValues(
        user?.doctorInfo?.specialities,
        specializations
      ),
      current_facility: user?.doctorInfo?.current_facility ?? "",
      medical_school: "",
    },
  });
  const fileRef = form.register("cv");

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
            Professional & academic history
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
            <div className="flex gap-6 max-sm:flex-col items-end">
              <FormBuilder
                name="medical_school"
                label="Where did you attend medical school"
                className="w-full"
              >
                <Input placeholder="Medical School" />
              </FormBuilder>
              <FormField
                control={form.control}
                name="cv"
                render={({ field: { onChange, value, ...field } }) => {
                  return (
                    <FormItem>
                      <FormLabel>Upload CV or Resume</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Paperclip className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            type="file"
                            accept=".pdf, .docx"
                            className="pl-8"
                            {...field}
                            value={undefined}
                            {...fileRef}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex gap-6 max-sm:flex-col">
              <FormBuilder
                name="license_number"
                label="Practitioner License Number"
                className="w-full"
              >
                <Input placeholder="Enter your licence number" />
              </FormBuilder>
              <FormBuilder
                name="experience"
                description="How long have you been a licensed Practitioner (Years)"
                message
                label="Years of Practice"
              >
                <Input placeholder="Years of practice" type="number" />
              </FormBuilder>
            </div>
            <FormBuilder
              name="current_facility"
              description={
                "Please enter the name of the hospital, clinic, or institution where you currently practice."
              }
              label="Your current facility"
              className="sm:-mt-4"
            >
              <Input placeholder="Where do you currently work" />
            </FormBuilder>

            <MultiSelector
              defaultOptions={specializations}
              form={form}
              name="specialities"
              empty="No specialities"
              label="Choose your Specialities (for Specialists only)"
              description="If your speciality is not in the dropdown. you can create you by typing it in"
              placeholder="Select Speciality"
              maxSelected={2}
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
