"use client";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { Input } from "@/components/ui/input";
import { Doctor } from "@/lib/definitions";
import { onDoctorBoardingSchema4 } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PhoneInput } from "@/components/ui/phone-input";
import SelectComponent from "@/components/blocks/selectComponent";
import AnimationWrapper from "@/components/wrappers/animationWrapper";
import { useFetchBanks } from "@/lib/server";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/blocks/loader";
import { PriceInput } from "@/components/blocks/priceselector";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveAccountDetails } from "@/lib/utils";
import { toast } from "sonner";
import PopoverSelect from "@/components/blocks/popoverselect";
import { DoctorOnboardStepFour } from "@/lib/onboarding";
import { useSession } from "next-auth/react";

const BankUpdateForm = ({ user }: { user: Doctor }) => {
  const [accountDetails, setAccountDetails] = useState<{
    account_name: string;
    account_number: string;
    bank_id: string;
  } | null>(null);
  const [resolveError, setResolveError] = useState(null);
  const { update, data: session } = useSession();
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
  } = useFetchBanks(channel === "mobile_money" ? "mobile_money" : "ghipss");

  console.log(form.formState.errors);
  useEffect(() => {
    if (channel) {
      form.setValue("account_name", "");
      form.setValue("account_number", "");
      form.setValue("bank", "");
      setResolveError(null);
      setAccountDetails(null);
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
      const res = await DoctorOnboardStepFour(data, 7);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          await update({
            ...session,
            user: {
              ...session?.user,
              doctorInfo: {
                ...session?.user?.doctorInfo,
                rate: res?.data?.doctorInfo.rate,
                onboarding_level: res?.data?.doctorInfo.onboarding_level,
              },
              onboarding_level: res?.data?.onboarding_level,
            },
          });
          toast.success("Successfully updated bank details");
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
    <div className="dark:bg-muted/40 bg-muted/70 p-10 max-sm:px-4 rounded-2xl shadow-md grid gap-4">
      <h2 className="text-xs uppercase text-muted-foreground">
        Update Bank Details
      </h2>
      {isLoading ? (
        <div className="w-full h-[300px] flex items-center flex-col justify-center">
          <Loader />
          <p className="text-sm text-muted-foreground">
            Fetching account details
          </p>
        </div>
      ) : isError ? (
        <div className="w-full h-[300px] flex items-center flex-col justify-center">
          <Info className="w-8 h-8 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Error fetching account details
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                  <AnimationWrapper className="space-y-5 mb-4">
                    <SelectComponent
                      name="bank"
                      label="Choose a Mobile money provider"
                      items={banks?.map((bank: any) => ({
                        value: bank?.bank_id,
                        label: bank?.name,
                      }))}
                      placeholder="Choose a mobile money provider"
                    />
                    <div className="flex items-end gap-5 max-sm:flex-col ">
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
                <div className="grid gap-4 mb-4">
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
              className="w-full mt-3"
              type="submit"
              disabled={isSubmitting || !accountDetails}
            >
              <span>Update Bank Details</span>
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default BankUpdateForm;
