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

const BankUpdateForm = ({ user }: { user: Doctor }) => {
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
  return (
    <div className="dark:bg-muted/40 bg-muted/70 p-10 max-sm:px-4 rounded-2xl shadow-md grid gap-4">
      <h2 className="text-xs uppercase text-muted-foreground">
        Location and address details
      </h2>

      <Form {...form}>
        <form>
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
            <div className="mt-6">
              <AnimationWrapper className="space-y-5">
                <SelectComponent
                  name="bank"
                  label="Choose a Mobile money provider"
                  items={bank?.map((bank: any) => ({
                    value: bank?.id,
                    label: bank?.name,
                  }))}
                  placeholder="Choose a mobile money provider"
                />
                <FormBuilder
                  name="account_number"
                  label="Enter your mobile money number"
                  message
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BankUpdateForm;
