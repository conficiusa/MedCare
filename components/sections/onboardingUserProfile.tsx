"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Session } from "next-auth";

const OnboardingUserProfile = ({
  form,
  session,
}: {
  form: UseFormReturn<z.output<typeof PatientOnboardingSchema>>;
  session: Session | any;
}) => {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row items-center gap-4"
    >
      <div className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Welcome Aboard! <br /> {session?.user?.name.split(" ")[0]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
            />
          </FormBuilder>
          <DatePickerForm
            name="dob"
            control={form.control}
            label="Choose your date of birth"
          />
        </CardContent>
      </div>
    </motion.div>
  );
};

export default OnboardingUserProfile;
