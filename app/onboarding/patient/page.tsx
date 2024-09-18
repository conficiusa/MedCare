"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";

import {
  UserIcon,
  CheckCircleIcon,
  HeartPulse,
  MapPinHouse,
} from "lucide-react";
import OnboardingUserProfile from "@/components/sections/onboardingUserProfile";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { PatientOnboardingSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import OnboardingAddress from "@/components/sections/onboardingAddress";
import OnBoardingMedicalHistory from "@/components/sections/onboardingMedicalHistory";
import { cn } from "@/lib/utils";
import OnboardingSummarypatient from "@/components/sections/onboardingSummarypatient";
import { usePatientOnboard } from "@/lib/formSubmissions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FieldNames =
  | "role"
  | "gender"
  | "phone"
  | "dob"
  | "region"
  | "city"
  | "country"
  | "languages"
  | "digitalAddress"
  | "street"
  | "medicalHistory"
  | "conditions"
  | `languages.${number}`
  | `languages.${number}.value`
  | `languages.${number}.label`;

const steps = [
  { title: "Personal Info", icon: UserIcon },
  { title: "Address", icon: MapPinHouse },
  { title: "Medical History", icon: HeartPulse },
  { title: "Summary", icon: CheckCircleIcon },
];

export default function Component() {
  const { data: session, update } = useSession();
  const [step, setStep] = useState(1);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const { onPatientOnboard } = usePatientOnboard(session, update);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleOnSubmit = async (
    data: z.output<typeof PatientOnboardingSchema>
  ) => {
    startTransition(async () => {
      try {
        await onPatientOnboard(data);
        confetti({
          particleCount: 1000,
          spread: 70,
          origin: { y: 0.6 },
        });
        router.push("/find-a-doctor");
      } catch (error) {
        toast.error("Oops! Something went wrong. Please try again.");
      }
    });
  };
  const form = useForm<z.output<typeof PatientOnboardingSchema>>({
    resolver: zodResolver(PatientOnboardingSchema),
    defaultValues: {
      dob: new Date(),
      role: "patient",
      city: "",
      phone: "",
      gender: "",
      region: "",
      street: "",
      country: "Ghana",
      digitalAddress: "",
      languages: [],
      conditions: [],
      medicalHistory: "",
    },
  });

  const handleNextStep = async () => {
    let fieldToValidate: FieldNames[];

    switch (step) {
      case 1:
        fieldToValidate = ["languages", "dob", "gender", "phone", "role"];
        break;
      case 2:
        fieldToValidate = [
          "region",
          "city",
          "country",
          "street",
          "digitalAddress",
        ];
        break;
      case 3:
        fieldToValidate = ["conditions", "medicalHistory"];
        break;
      default:
        fieldToValidate = [];
    }

    const isValid = await form.trigger(fieldToValidate);

    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    } else {
      setShakeAnimation(true);
      setTimeout(() => setShakeAnimation(false), 500);
    }
  };
  const handlePrevious = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <OnboardingUserProfile form={form} session={session} />;
      case 2:
        return <OnboardingAddress form={form} />;
      case 3:
        return <OnBoardingMedicalHistory form={form} />;
      case 4:
        return <OnboardingSummarypatient form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-50 via-purple-50 to-blue-50  flex items-center justify-center">
      <Card className="w-full mx-auto overflow-hidden border-none">
        <div className="p-8">
          <div className="flex justify-around mb-12">
            {steps.map((s, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index + 1 < step
                    ? "text-green-500"
                    : index + 1 === step
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
              >
                <motion.div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                    index + 1 < step
                      ? "border-green-500 bg-green-500 text-white"
                      : index + 1 === step
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-400 bg-gray-100 text-gray-400"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {React.createElement(s.icon, { size: 24 })}
                </motion.div>
                <span className="text-sm mt-2 font-medium">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2">
            <div className={cn("", step === steps.length && "col-span-2")}>
              <AnimatePresence mode="wait">
                <Form {...form}>
                  <form>{renderStep()}</form>
                </Form>
              </AnimatePresence>
              <CardFooter className="flex justify-between">
                <Button
                  onClick={handlePrevious}
                  disabled={step === 1}
                  size="lg"
                  variant="outline"
                >
                  Previous
                </Button>
                <motion.div
                  animate={shakeAnimation ? { x: [-5, 5, -5, 5, 0] } : {}}
                >
                  {step === steps.length ? (
                    <Button
                      size="lg"
                      type="submit"
                      disabled={step !== steps.length || isPending}
                      onClick={form.handleSubmit(handleOnSubmit)}
                    >
                      Complete
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleNextStep}
                      disabled={step === steps.length}
                      type="button"
                    >
                      Next
                    </Button>
                  )}
                </motion.div>
              </CardFooter>
            </div>
            <div
              className={cn(
                "relative hidden md:block",
                step === steps.length && "hidden"
              )}
            >
              <Image
                src="/onboarding.jpg"
                alt="Welcome illustration"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-md object-cover absolute"
                priority
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
