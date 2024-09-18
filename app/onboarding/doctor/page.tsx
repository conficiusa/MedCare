"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UserIcon,
  BuildingIcon,
  BriefcaseIcon,
  LightbulbIcon,
  CheckCircleIcon,
  HelpCircleIcon,
} from "lucide-react";
import OnboardingUserProfile from "@/components/sections/onboardingUserProfile";

type UserData = {
  name: string;
  email: string;
  companySize: string;
  role: string;
  interests: string[];
};

const initialUserData: UserData = {
  name: "",
  email: "",
  companySize: "",
  role: "",
  interests: [],
};

const steps = [
  { title: "Personal Info", icon: UserIcon },
  { title: "Company Size", icon: BuildingIcon },
  { title: "Your Role", icon: BriefcaseIcon },
  { title: "Interests", icon: LightbulbIcon },
  { title: "Summary", icon: CheckCircleIcon },
];

export default function Component() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [shakeAnimation, setShakeAnimation] = useState(false);

  useEffect(() => {
    if (step === steps.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [step]);

  const updateUserData = (field: keyof UserData, value: string | string[]) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (isStepValid()) {
      if (step < steps.length) setStep((prev) => prev + 1);
    } else {
      setShakeAnimation(true);
      setTimeout(() => setShakeAnimation(false), 500);
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return userData.name.trim() !== "" && userData.email.trim() !== "";
      case 2:
        return userData.companySize !== "";
      case 3:
        return userData.role !== "";
      case 4:
        return userData.interests.length > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        // return <OnboardingUserProfile />;
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={userData.companySize}
                  onValueChange={(value) =>
                    updateUserData("companySize", value)
                  }
                  className="space-y-4"
                >
                  {["1-10", "11-50", "51-200", "201+"].map((size) => (
                    <motion.div
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 bg-secondary p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg"
                    >
                      <RadioGroupItem
                        value={size}
                        id={size}
                        className="w-6 h-6"
                      />
                      <Label
                        htmlFor={size}
                        className="text-xl font-medium flex-grow"
                      >
                        {size} employees
                      </Label>
                      <BuildingIcon className="w-6 h-6 text-primary" />
                    </motion.div>
                  ))}
                </RadioGroup>
              </CardContent>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Company size illustration"
                width={300}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                  Your Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={userData.role}
                  onValueChange={(value) => updateUserData("role", value)}
                >
                  <SelectTrigger className="text-lg p-6 rounded-xl border-2 border-primary/50 focus:border-primary transition-all duration-300">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Developer",
                      "Designer",
                      "Product Manager",
                      "Marketing",
                      "Sales",
                      "Other",
                    ].map((role) => (
                      <SelectItem
                        key={role}
                        value={role.toLowerCase()}
                        className="text-lg"
                      >
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-4 text-center text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircleIcon className="inline-block mr-1" />
                        Why do we ask this?
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          We use this information to personalize your
                          experience.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Role selection illustration"
                width={300}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                  Areas of Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Analytics",
                    "Automation",
                    "Collaboration",
                    "Security",
                    "Integration",
                  ].map((interest) => (
                    <motion.div
                      key={interest}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        userData.interests.includes(interest)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                      onClick={() => {
                        if (userData.interests.includes(interest)) {
                          updateUserData(
                            "interests",
                            userData.interests.filter((i) => i !== interest)
                          );
                        } else {
                          updateUserData("interests", [
                            ...userData.interests,
                            interest,
                          ]);
                        }
                      }}
                    >
                      <Checkbox
                        id={interest}
                        checked={userData.interests.includes(interest)}
                        onCheckedChange={() => {}}
                        className="w-6 h-6"
                      />
                      <Label
                        htmlFor={interest}
                        className="text-xl font-medium flex-grow"
                      >
                        {interest}
                      </Label>
                      <LightbulbIcon className="w-6 h-6" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Interests illustration"
                width={300}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                  Almost There!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(userData).map(([key, value]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 * Object.keys(userData).indexOf(key),
                      }}
                      className="bg-secondary p-6 rounded-xl shadow-md"
                    >
                      <p className="text-xl">
                        <span className="font-bold capitalize">{key}:</span>{" "}
                        {Array.isArray(value) ? value.join(", ") : value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Summary illustration"
                width={300}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-50 via-purple-50 to-blue-50  flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between mb-12">
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
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          <CardFooter className="flex justify-between mt-12">
            <Button
              onClick={handlePrevious}
              disabled={step === 1}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Previous
            </Button>
            <motion.div
              animate={shakeAnimation ? { x: [-10, 10, -10, 10, 0] } : {}}
            >
              <Button
                onClick={handleNext}
                disabled={step === steps.length}
                size="lg"
                className="text-lg px-8 py-6 rounded-xl bg-primary text-primary-foreground transition-all duration-300 hover:scale-105"
              >
                {step === steps.length - 1 ? "Complete" : "Next"}
              </Button>
            </motion.div>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
