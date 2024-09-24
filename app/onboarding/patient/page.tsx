"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import OnboardingSideNav from "@/components/blocks/onboardingSideNav";
import OnboardingUserProfile from "@/components/sections/onboardingUserProfile";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PatientOnboardingSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import OnboardingAddress from "@/components/sections/onboardingAddress";
import OnBoardingMedicalHistory from "@/components/sections/onboardingMedicalHistory";
import { useSession } from "next-auth/react";
import OnboardingProfileUpload from "@/components/sections/onboardingprofileupload";
import { usePatientOnboard } from "@/lib/formSubmissions";
import { useRouter } from "next/navigation";

export type Step = "details" | "location" | "history" | "profile" | "welcome";
export default function Component() {
  const [currentStep, setCurrentStep] = useState<Step>("profile");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { data: session, update } = useSession();

  const { onPatientOnboard } = usePatientOnboard(session, update);

  const handleSubmit = (data: z.output<typeof PatientOnboardingSchema>) => {
    startTransition(async () => {
      try {
        await onPatientOnboard(data);
        router.push("/find-a-doctor");
      } catch (error: any) {
        console.log(error);
      }
    });
  };
  const form = useForm<z.output<typeof PatientOnboardingSchema>>({
    resolver: zodResolver(PatientOnboardingSchema),
    defaultValues: {
      dob: null,
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

  const steps: Step[] = [
    "details",
    "location",
    "history",
    "profile",
    "welcome",
  ];

  const skipableSteps: Step[] = ["history", "profile"];

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "details":
        return (
          <OnboardingUserProfile
            form={form}
            session={session}
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        );
      case "location":
        return (
          <OnboardingAddress
            form={form}
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        );
      case "history":
        return (
          <OnBoardingMedicalHistory
            form={form}
            currentStep={currentStep}
            steps={steps}
            setCurrentStep={setCurrentStep}
          />
        );
      case "profile":
        return (
          <OnboardingProfileUpload
            form={form}
            steps={steps}
            setCurrentStep={setCurrentStep}
          />
        );
      case "welcome":
        return (
          <div className="text-center w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-2">Welcome to Medcare Hub!</h2>
            <p className="text-muted-foreground text-sm mb-8">
              We are excited to have you onboard. Please complete the onboarding
              process to get started.
            </p>
            <div className="w-full relative aspect-video bg-gray-200 rounded-lg mb-8 overflow-hidden">
              <Image
                src="/signIn.jpg"
                alt="Onboarding"
                fill
                sizes="(min-width: 640px) 640px, 100vw"
                className="object-cover"
              />
            </div>
            <Button
              disabled={isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
              onClick={form.handleSubmit(handleSubmit)}
            >
              Finish up
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <OnboardingSideNav currentStep={currentStep} steps={steps} />
          <div className="w-full md:w-[calc(100%-240px)] p-6 flex flex-col justify-between min-h-[600px] ">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center sm:px-4"
              >
                <Form {...form}>
                  <form className="w-full">{renderStepContent()}</form>
                </Form>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between items-center mt-8">
              {currentStep !== "details" ? (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              ) : (
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to home
                </Link>
              )}
              <div className="flex space-x-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={step}
                    className={`w-2 h-2 rounded-full ${
                      steps.indexOf(currentStep) >= index
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                    initial={false}
                    animate={{
                      scale: steps.indexOf(currentStep) === index ? 1.5 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                ))}
              </div>
              {currentStep !== "welcome" &&
                skipableSteps.includes(currentStep) && (
                  <Button
                    variant="ghost"
                    onClick={handleNext}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Skip
                  </Button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
