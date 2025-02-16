"use client";
import { motion } from "framer-motion";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { onDoctorBoardingSchema4 } from "@/lib/schema";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { Button } from "@/components/ui/button";
import { Step } from "@/components/blocks/onboardingDoctor";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCallback, useEffect, useMemo, useState } from "react";
import AnimationWrapper from "@/components/wrappers/animationWrapper";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import SelectComponent from "@/components/blocks/selectComponent";
import { useFetchBanks } from "@/lib/server";
import { Skeleton } from "../ui/skeleton";
import PopoverSelect from "../blocks/popoverselect";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { DoctorOnboardStepFour } from "@/lib/onboarding";
import { toast } from "sonner";
import { Bank, Doctor } from "@/lib/definitions";
import { UpdateSession } from "next-auth/react";
import { Session } from "next-auth";
import { PriceInput } from "../blocks/priceselector";
import Loader from "../blocks/loader";
import { validatePhoneNumber } from "@/lib/carrierValidate";
import { resolveAccountDetails } from "@/lib/utils";

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
  const [accountDetails, setAccountDetails] = useState<{
    account_name: string;
    account_number: string;
    bank_id: string;
  } | null>(null);
  const [resolveError, setResolveError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.output<typeof onDoctorBoardingSchema4>>({
    resolver: zodResolver(onDoctorBoardingSchema4),
    defaultValues: {
      account_name: user?.doctorInfo?.account_name ?? "",
      account_number: user?.doctorInfo?.account_number ?? "",
      bank: user?.doctorInfo?.bank ?? "",
      payment_channel:
        (user?.doctorInfo?.payment_channel as "mobile_money" | "ghipss") ??
        "mobile_money",
      rate: user?.doctorInfo?.rate ?? 0,
    },
  });
  const channel = form.watch("payment_channel");
  const account = form.watch("account_number");
  const bank = form.watch("bank");
  const resolveAccount = async () => {
    await resolveAccountDetails({
      bank: form.watch("bank"),
      account_number: form.watch("account_number"),
      banks: banks ?? [],
      setAccountDetails,
      setResolveError,
      setIsSubmitting,
      form,
    });
  };

  const {
    data: banks,
    isLoading,
    isError,
  } = useFetchBanks(
    form.watch("payment_channel") === "mobile_money" ? "mobile_money" : "ghipss"
  );
  useEffect(() => {
    if (channel) {
      form.setValue("account_name", "");
      form.setValue("account_number", "");
      form.setValue("bank", "");
    }
  }, [form, channel]);
  useEffect(() => {
    if (account) {
      setAccountDetails(null);
    }
  }, [account]);

  useEffect(() => {
    if (bank) {
      setAccountDetails(null);
    }
  }, [bank]);
  useEffect(() => {
    if (form.formState.errors.account_name) {
      toast.error("Please resolve account details");
    }
  }, [form]);

  useEffect(() => {
    const validate = async () => {
      if (form.watch("bank")) {
        if (form.watch("account_number")) {
          await form.trigger("account_number");
        }
      }
    };
    validate();
  }, [form]);

  const handleSubmit = async (
    data: z.output<typeof onDoctorBoardingSchema4>
  ) => {
    try {
      if (!accountDetails) {
        toast.error("Please resolve account details");
        return;
      }
      const res = await DoctorOnboardStepFour(data);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          await update({
            ...session,
            user: {
              ...session.user,
              doctorInfo: {
                ...session?.user?.doctorInfo,
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

  if (isLoading)
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <Loader />
      </div>
    );
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
              <FormField
                control={form.control}
                name="payment_channel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Receive Payments via:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="mobile_money" id="mobile" />
                          </FormControl>
                          <FormLabel className="font-normal" htmlFor="mobile">
                            Mobile Money
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="ghipss" />
                          </FormControl>
                          <FormLabel className="font-normal">Bank</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("payment_channel") === "mobile_money" ? (
                <div className="mt-6">
                  <AnimationWrapper className="space-y-5">
                    <SelectComponent
                      name="bank"
                      label="Choose a Mobile money provider"
                      items={banks?.map((bank: Bank) => ({
                        value: bank?.bank_id,
                        label: bank?.name,
                      }))}
                      placeholder="Choose a mobile money provider"
                    />
                    <div className="flex items-end gap-5 max-sm:flex-col">
                      <FormBuilder
                        name="account_number"
                        label="Enter your mobile money number"
                        message
                        className="sm:flex-1 w-full"
                      >
                        <PhoneInput
                          type="text"
                          placeholder="Enter your mobile money number"
                          international={false}
                          defaultCountry="GH"
                        />
                      </FormBuilder>
                      <Button
                        size={"sm"}
                        onClick={async () => await resolveAccount()}
                        type="button"
                        disabled={
                          isSubmitting ||
                          !form.watch("account_number") ||
                          !form.watch("bank")
                        }
                      >
                        {isSubmitting ? "Resolving..." : "Resolve Account"}
                      </Button>
                    </div>
                    {accountDetails && (
                      <p className="text-primary text-xs  ">
                        Account successfully resolved with the name{" "}
                        {accountDetails?.account_name}
                      </p>
                    )}
                    {resolveError && (
                      <p className="text-destructive text-xs  ">
                        {resolveError}
                      </p>
                    )}
                  </AnimationWrapper>
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
                      value: bank?.bank_id,
                      label: bank?.name,
                    }))}
                  />
                  <div className="flex items-end gap-5 max-sm:flex-col">
                    <FormBuilder
                      name="account_number"
                      label="Enter account number"
                      className="sm:flex-1 w-full"
                    >
                      <Input type="number" placeholder="Enter account number" />
                    </FormBuilder>
                    <Button
                      size={"sm"}
                      onClick={async () => await resolveAccount()}
                      type="button"
                      disabled={
                        isSubmitting ||
                        !form.watch("account_number") ||
                        !form.watch("bank")
                      }
                    >
                      {isSubmitting ? "Resolving..." : "Resolve Account"}
                    </Button>
                  </div>
                  {accountDetails && (
                    <p className="text-primary text-xs  ">
                      Account successfully resolved with the name{" "}
                      {accountDetails?.account_name}
                    </p>
                  )}
                  {resolveError && (
                    <p className="text-destructive text-xs  ">{resolveError}</p>
                  )}
                </div>
              )}
            </div>

            <PriceInput form={form} />
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
