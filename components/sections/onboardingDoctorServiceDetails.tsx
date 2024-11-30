"use client";
import { motion } from "framer-motion";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { onDoctorBoardingSchema4 } from "@/lib/schema";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { Button } from "@/components/ui/button";
import { Step } from "@/components/blocks/onboardingDoctor";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { MessageSquare, Smartphone, Video, Wallet } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import AnimationWrapper from "@/components/wrappers/animationWrapper";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import SelectComponent from "@/components/blocks/selectComponent";
import { useFetchBanks } from "@/lib/server";
import { Skeleton } from "../ui/skeleton";
import PopoverSelect from "../blocks/popoverselect";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { DoctorOnboardStepFour } from "@/lib/onboarding";
import { toast } from "sonner";
import { Doctor } from "@/lib/definitions";
import { UpdateSession } from "next-auth/react";
import { Session } from "next-auth";

type PaymentMethod = "bank" | "mobile_money";
type ConsultationMethod = "chat" | "video";
const DoctorOnboardingServiceDetails = ({
  currentStep,
  setCurrentStep,
  steps,
  user,
  update,
  session,
}: {
  currentStep: Step;
  steps: Step[];
  setCurrentStep: (step: Step) => void;
  user: Doctor;
  update: UpdateSession;
  session: Session;
}) => {

  const [selectedMethods, setSelectedMethods] = useState<ConsultationMethod[]>(
    user?.doctorInfo?.media && user?.doctorInfo?.media?.length > 0
      ? (user?.doctorInfo?.media as ConsultationMethod[])
      : []
  );
  const [selectedPayMethod, setSelectedPayMethod] = useState<PaymentMethod>(
    (user?.doctorInfo?.payment_channel as PaymentMethod) ?? "mobile_money"
  );

  const form = useForm<z.output<typeof onDoctorBoardingSchema4>>({
    resolver: zodResolver(onDoctorBoardingSchema4),
    defaultValues: {
      account_name: user?.doctorInfo?.account_name ?? "",
      account_number: user?.doctorInfo?.account_number ?? "",
      bank: user?.doctorInfo?.bank ?? "",
      media: user?.doctorInfo?.media.length > 0 ? user?.doctorInfo?.media : [],
      payment_channel: user?.doctorInfo?.payment_channel,
      rate: user?.doctorInfo?.rate ?? 0,
    },
  });
  const {
    data: banks,
    isLoading,
    isError,
  } = useFetchBanks(
    selectedPayMethod === "mobile_money" ? "mobile_money" : "ghipss"
  );

  const toggleMethod = (method: ConsultationMethod) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  useEffect(() => {
    if (selectedPayMethod) {
      form.setValue("payment_channel", selectedPayMethod);
    }
  }, [form, selectedPayMethod]);

  useEffect(() => {
    if (selectedMethods) {
      form.setValue("media", selectedMethods);
    }
  }, [selectedMethods, form]);

  useEffect(() => {
    if (selectedPayMethod) {
      form.setValue("payment_channel", selectedPayMethod);
      form.setValue("bank", "");
      form.setValue("account_name", "");
      form.setValue("account_number", "");
    }
  }, [selectedPayMethod, form]);

  const handleSubmit = async (
    data: z.output<typeof onDoctorBoardingSchema4>
  ) => {
    try {
      const res = await DoctorOnboardStepFour(data);
      console.log(res);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          await update({
            ...session,
            user: {
              ...session.user,
              doctorInfo: {
                ...session?.user?.doctorInfo,
                media: res?.data?.doctorInfo.media,
                rate: res?.data?.doctorInfo.rate,
                onboarding_level: res?.data?.doctorInfo.onboarding_level,
              },
              onboarding_level: res?.data?.onboarding_level,
            },
          });
          const currentIndex = steps.indexOf(currentStep);
          setCurrentStep(steps[currentIndex + 1]);
        }
      } else {
        toast.success("Failed", {
          description: "If the error persist contact us",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

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
        <CardHeader className="px-0">
          <CardTitle className="text-lg font-medium">Service Details</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form
            className="grid gap-8"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="space-y-4">
              <Label>Choose your suitable consultation methods</Label>
              <div className="flex gap-10">
                <div className="relative flex items-start">
                  <Checkbox
                    id="chat"
                    checked={selectedMethods.includes("chat")}
                    onCheckedChange={() => toggleMethod("chat")}
                    className="mr-2 mt-1"
                  />
                  <Label
                    htmlFor="chat"
                    className="flex aspect-video flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer flex-grow"
                  >
                    <MessageSquare className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">
                      Chat Consultation
                    </span>
                  </Label>
                </div>
                <div className="relative flex items-start">
                  <Checkbox
                    id="video"
                    checked={selectedMethods.includes("video")}
                    onCheckedChange={() => toggleMethod("video")}
                    className="mr-2 mt-1"
                  />
                  <Label
                    htmlFor="video"
                    className="flex aspect-video flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer flex-grow"
                  >
                    <Video className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium ">
                      Video Consultation
                    </span>
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>How would you like to get paid?</Label>
              <RadioGroup
                value={selectedPayMethod}
                onValueChange={(value) =>
                  setSelectedPayMethod(value as PaymentMethod)
                }
                className="flex gap-10 pl-6"
              >
                <div className="relative">
                  <RadioGroupItem
                    value="mobile_money"
                    id="mobile_money"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="mobile_money"
                    className="flex flex-col aspect-video items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    <Smartphone className="mb-3 h-6 w-5 text-primary" />
                    <span className="">Mobile Money</span>
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem
                    value="bank"
                    id="bank"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="bank"
                    className="flex aspect-video flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    <Wallet className="mb-3 h-6 w-5 text-primary" />
                    <span className="">Bank Transfer</span>
                  </Label>
                </div>
              </RadioGroup>
              {selectedPayMethod === "mobile_money" ? (
                isLoading ? (
                  <div className="w-full grid gap-4">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                  </div>
                ) : (
                  <div className="mt-6">
                    <AnimationWrapper className="space-y-5">
                      <SelectComponent
                        name="bank"
                        label="Choose a Mobile money provider"
                        items={banks?.map((bank: any) => ({
                          value: bank?.id,
                          label: bank?.name,
                        }))}
                        placeholder="Choose a mobile money provider"
                      />
                      <FormBuilder
                        name="account_number"
                        label="Enter your mobile money number"
                      >
                        <PhoneInput
                          type="text"
                          placeholder="Enter your mobile money number"
                          international={false}
                          defaultCountry="GH"
                        />
                      </FormBuilder>
                      <FormBuilder
                        name="account_name"
                        label="Enter the name on your mobile money account"
                      >
                        <Input
                          type="text"
                          placeholder="Enter your mobile money account name"
                        />
                      </FormBuilder>
                    </AnimationWrapper>
                  </div>
                )
              ) : isLoading ? (
                <div className="w-full grid gap-4">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              ) : (
                <div className="grid gap-4">
                  <PopoverSelect
                    form={form}
                    search="Search Banks"
                    placeholder="Choose your bank"
                    error={isError}
                    name="bank"
                    label="Choose your bank"
                    loading={isLoading}
                    items={banks?.map((bank: any) => ({
                      value: bank?.id,
                      label: bank?.name,
                    }))}
                  />
                  <FormBuilder
                    name="account_number"
                    label="Enter account number"
                  >
                    <Input type="number" placeholder="Enter account number" />
                  </FormBuilder>
                  <FormBuilder name="account_name" label="Account name">
                    <Input
                      type="text"
                      placeholder="Enter the name registered with the account"
                    />
                  </FormBuilder>
                </div>
              )}
            </div>

            <div>
              <FormBuilder
                name="rate"
                label="Rate per consultation (GHS)"
                description={"This is how much you bill per consultation"}
              >
                <Input type="number" className="w-48" />
              </FormBuilder>
            </div>

            <Button
              className="w-full mt-4"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};

export default DoctorOnboardingServiceDetails;
