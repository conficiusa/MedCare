"use client";
import { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import OnboardingDoctorProfile from "@/components/sections/onboardingDoctorProfile";
import OnboardingDoctorAddress from "@/components/sections/onboardingDoctorAddress";
import DoctorOnboardingSideNav from "./doctorOnboardingSideNav";
import DoctorOnboardingCredentials from "@/components/sections/onBoardingDoctorCredentials";
import DoctorOnboardingServiceDetails from "@/components/sections/onboardingDoctorServiceDetails";
import DoctorImageUpload from "@/components/sections/onboardingDoctorProfileUpload";
import { Doctor } from "@/lib/definitions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { toast } from "sonner";

export type Step =
  | "details"
  | "location"
  | "credentials"
  | "profile"
  | "bank_account"
  | "welcome";
export default function DoctorOnboarding({ user }: { user: Doctor }) {
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const { update, data: session } = useSession();
  const router = useRouter();
  const steps: Step[] = [
    "details",
    "location",
    "credentials",
    "bank_account",
    "profile",
    "welcome",
  ];

  useEffect(() => {
    if (!session) {
      router.push("/sign-in");
    }
  }, [session, router]);

  useEffect(() => {
    if (user?.onboarding_level && user.onboarding_level > 1) {
      setCurrentStep(steps[user?.onboarding_level - 1]);
    }
  }, [user]);
  const skipableSteps: Step[] = ["profile"];

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
          <OnboardingDoctorProfile
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            user={user}
            update={update}
            session={session as Session}
          />
        );
      case "location":
        return (
          <OnboardingDoctorAddress
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            user={user}
            update={update}
            session={session as Session}
          />
        );
      case "credentials":
        return (
          <DoctorOnboardingCredentials
            currentStep={currentStep}
            steps={steps}
            setCurrentStep={setCurrentStep}
            user={user}
            update={update}
            session={session as Session}
          />
        );
      case "bank_account":
        return (
          <DoctorOnboardingServiceDetails
            currentStep={currentStep}
            steps={steps}
            setCurrentStep={setCurrentStep}
            user={user}
            update={update}
            session={session as Session}
          />
        );
      case "profile":
        return (
          <DoctorImageUpload
            currentStep={currentStep}
            steps={steps}
            setCurrentStep={setCurrentStep}
            user={user}
            update={update}
            session={session as Session}
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
            <div className="w-full relative aspect-video bg-muted/20 dark:bg-background rounded-lg mb-8 overflow-hidden">
              <Image
                src="/signIn.jpg"
                alt="Onboarding"
                fill
                sizes="(min-width: 640px) 640px, 100vw"
                className="object-cover"
              />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md">
              Finish up
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[100dvh] bg-muted dark:bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl dark:bg-muted/30 bg-background rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <DoctorOnboardingSideNav currentStep={currentStep} steps={steps} />
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
                <div className="w-full">{renderStepContent()}</div>
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
