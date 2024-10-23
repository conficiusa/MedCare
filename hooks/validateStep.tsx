import { PatientOnboardingSchema } from "@/lib/schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type PatientOnboardingFields = keyof z.infer<typeof PatientOnboardingSchema>;

const validateStep = async (
  form: UseFormReturn<z.output<typeof PatientOnboardingSchema>>,
  fieldsToValidate: PatientOnboardingFields | PatientOnboardingFields[]
) => {
  const isValid = await form.trigger(fieldsToValidate);
  return isValid;
};

export default validateStep;
