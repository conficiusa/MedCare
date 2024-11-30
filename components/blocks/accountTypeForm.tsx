"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserIcon, StethoscopeIcon, ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const AccountTypeForm = () => {
  const [accountType, setAccountType] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  useEffect(() => {
    router.prefetch("/onboarding/patient");
    router.prefetch("/onboarding/doctor");
  }, [router]);

  const handleContinue = () => {
    startTransition(() => {
      router.push(`/onboarding/${accountType}`);
    });
  };

  return (
    <div className={cn(isPending && "pointer-events-none")}>
      <RadioGroup
        onValueChange={setAccountType}
        className="flex flex-col space-y-4"
      >
        <Label
          htmlFor="patient"
          className="flex flex-col items-center space-y-3 cursor-pointer"
        >
          <RadioGroupItem value="patient" id="patient" className="sr-only" />
          <div
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              accountType === "patient"
                ? "border-primary bg-primary/10"
                : "border-border"
            }`}
          >
            <div className="flex items-center space-x-2">
              <UserIcon className="w-6 h-6 text-primary" />
              <span className="font-medium">Patient Account</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              For individuals seeking medical care
            </p>
          </div>
        </Label>
        <Label
          htmlFor="doctor"
          className="flex flex-col items-center space-y-3 cursor-pointer"
        >
          <RadioGroupItem value="doctor" id="doctor" className="sr-only" />
          <div
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              accountType === "doctor"
                ? "border-primary bg-primary/10"
                : "border-border"
            }`}
          >
            <div className="flex items-center space-x-2">
              <StethoscopeIcon className="w-6 h-6 text-primary" />
              <span className="font-medium">Doctor Account</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              For healthcare providers
            </p>
          </div>
        </Label>
      </RadioGroup>
      <motion.div
        className="w-full pt-4 pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: accountType ? 1 : 0, y: accountType ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={handleContinue}
          disabled={!accountType || isPending}
          className="w-full"
        >
          Continue
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default AccountTypeForm;
