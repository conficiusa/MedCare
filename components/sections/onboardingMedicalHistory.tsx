"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { PatientOnboardingSchema } from "@/lib/schema";
import { FormBuilder } from "@/components/blocks/formBuilder";
import MultiSelector from "@/components/blocks/multipleSelector";
import { conditions } from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const OnBoardingMedicalHistory = ({
  form,
}: {
  form: UseFormReturn<z.output<typeof PatientOnboardingSchema>>;
}) => {
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
            Medical History
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
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
        </CardContent>
      </div>
    </motion.div>
  );
};

export default OnBoardingMedicalHistory;
