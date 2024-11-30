import {
  Briefcase,
  Camera,
  CreditCard,
  HeartPulse,
  MapPinHouse,
  Rocket,
  Stethoscope,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { Step } from "@/components/blocks/onboardingDoctor";
import { cn } from "@/lib/utils";
import Logo from "@/components/blocks/logo";

const DoctorOnboardingSideNav = ({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: Step;
}) => {
  return (
    <div className="w-full md:w-[300px] p-6 border-b md:border-b-0 md:border-r border-border">
      <div className="flex items-center mb-8">
        <h1 className={cn(" font-semibold flex gap-2 items-center")}>
          MedCare Hub <Logo />
        </h1>
      </div>
      <nav className="relative">
        <div className="absolute left-[16px] top-1 bottom-1 w-px bg-muted"></div>
        <div className="space-y-10">
          {steps.map((step) => (
            <div key={step} className="flex items-start relative z-10">
              <motion.div
                className={`rounded-full bg-muted p-2 ${
                  currentStep === step
                    ? "text-white bg-primary"
                    : "text-muted-foreground"
                }`}
                animate={{ scale: currentStep === step ? 1.2 : 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {step === "details" && <User className="w-5 h-5" />}
                {step === "location" && <MapPinHouse className="w-5 h-5" />}
                {step === "profile" && <Camera className="w-5 h-5" />}
                {step === "credentials" && <Stethoscope className="w-5 h-5" />}
                {step === "bank_account" && <Briefcase className="w-5 h-5" />}
                {step === "welcome" && <Rocket className="w-5 h-5" />}
              </motion.div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep === step ? "primary" : ""
                  }`}
                >
                  {step === "details" && "Your details"}
                  {step === "location" && "Your location"}
                  {step === "credentials" && "Professional History"}
                  {step === "profile" && "Picture"}
                  {step === "bank_account" && "Service Details"}
                  {step === "welcome" && "Welcome to Medcare"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step === "details" && "Provide your personal details"}
                  {step === "location" && "Set your location"}
                  {step === "credentials" &&
                    "We will use this information to verify you as a Doctor"}
                  {step === "profile" && "Upload a profile picture"}
                  {step === "bank_account" &&
                    "Add details abput the service you provide"}
                  {step === "welcome" && "Get up and running in 3 minutes"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DoctorOnboardingSideNav;
