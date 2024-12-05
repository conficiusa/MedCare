"use client";
import * as React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { onDoctorBoardingSchema1 } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectComponent from "@/components/blocks/selectComponent";
import { PhoneInput } from "@/components/ui/phone-input";
import DatePickerForm from "@/components/blocks/dobpicker";
import MultiSelector from "@/components/blocks/multipleSelector";
import { languages } from "@/lib/data";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Step } from "@/components/blocks/onboardingDoctor";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { DoctorOnboardStepOne } from "@/lib/onboarding";
import { Doctor } from "@/lib/definitions";
import { UpdateSession } from "next-auth/react";
import { Session } from "next-auth";
import { formatPhoneNumber } from "react-phone-number-input";

const OnboardingDoctorProfile = ({
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
  user: Doctor;
  session: Session;
  update: UpdateSession;
}) => {
  const form = useForm<z.output<typeof onDoctorBoardingSchema1>>({
    resolver: zodResolver(onDoctorBoardingSchema1),
    defaultValues: {
      dob: undefined,
      role: "doctor",
      gender: "",
      languages: [],
      phone: "",
    },
  });
  const handleSubmit = async (
    data: z.output<typeof onDoctorBoardingSchema1>
  ) => {
    try {
      const res = await DoctorOnboardStepOne(data);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          await update({
            ...session,
            user: {
              ...session.user,
              dob: res?.data?.dob,
              languages: res?.data?.languages,
              phone: res?.data?.phone,
              role: res?.data?.role,
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
      console.log(error);
      toast.error(error.message);
    }
  };

  React.useEffect(() => {
    if (user) {
      form.setValue("dob", user?.dob ? new Date(user?.dob) : undefined);
      form.setValue("gender", user?.gender);
      form.setValue(
        "languages",
        user.languages?.length > 0
          ? languages.filter((lang) => user?.languages?.includes(lang.value))
          : []
      );
      form.setValue("phone", formatPhoneNumber(user?.phone));
    }
  }, [user, form]);

  return (
    <div className="w-full">
      <CardHeader className="px-0">
        <CardTitle
          className={cn("text-base antialiased font-semibold text-opacity-90")}
        >
          Welcome Aboard!
        </CardTitle>
        <CardDescription>
          Fill the form below to complete your onboarding process
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-5">
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
                initialValueFormat="national"
                international={false}
              />
            </FormBuilder>
            <DatePickerForm
              name="dob"
              control={form.control}
              label="Choose your date of birth"
            />
            <div>
              <Button
                className="w-full "
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                Continue
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OnboardingDoctorProfile;
