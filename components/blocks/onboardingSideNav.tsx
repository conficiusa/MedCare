import { Step } from "@/app/onboarding/patient/page";
import { Camera, HeartPulse, MapPinHouse, Rocket, User } from "lucide-react";
import { motion } from "framer-motion";

const OnboardingSideNav = ({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: Step;
}) => {
  return (
    <div className="w-full md:w-[240px] p-6 border-b md:border-b-0 md:border-r border-gray-200">
      <div className="flex items-center mb-8">
        <svg
          className="w-8 h-8 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4h16v16H4V4z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 9h6v6H9V9z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="text-xl font-semibold">MedCare Hub</h1>
      </div>
      <nav className="relative">
        <div className="absolute left-[11px] top-1 bottom-1 w-px bg-gray-200"></div>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step} className="flex items-start relative z-10">
              <motion.div
                className={`rounded-full bg-white p-1 ${
                  currentStep === step ? "text-green-600" : "text-gray-400"
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
                {step === "history" && <HeartPulse className="w-5 h-5" />}
                {step === "profile" && <Camera className="w-5 h-5" />}
                {step === "welcome" && <Rocket className="w-5 h-5" />}
              </motion.div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep === step ? "text-green-600" : "text-gray-900"
                  }`}
                >
                  {step === "details" && "Your details"}
                  {step === "location" && "Your location"}
                  {step === "history" && "Medical history"}
                  {step === "profile" && "Picture"}
                  {step === "welcome" && "Welcome to Medcare"}
                </p>
                <p className="text-sm text-gray-500">
                  {step === "details" && "Provide your personal details"}
                  {step === "location" && "Set your location"}
                  {step === "history" &&
                    "Provide information on your medical history"}
                  {step === "profile" && "Upload a profile picture"}
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

export default OnboardingSideNav;
