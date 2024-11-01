"use client";
import { CheckoutSchema } from "@/lib/schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import Image from "next/image";

const CheckoutpaymentInfo = ({
  form,
}: {
  form: UseFormReturn<z.output<typeof CheckoutSchema>>;
}) => {
  const handleTabChange = (value: string) => {
    form.setValue("channel", value as "mobile_money" | "card");
  };
  const handleMobileMoneyChange = (value: string) => {
    form.setValue("mobileMoneyType", value as "mtn" | "vod" | "atl");
  };

  return (
    <div>
      <p className=" font-semibold mb-6">Payment details</p>
      <Tabs
        defaultValue={form.getValues("channel")}
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="mobile_money">Mobile Money</TabsTrigger>
          <TabsTrigger value="card">Card</TabsTrigger>
        </TabsList>
        <TabsContent value="mobile_money">
          <RadioGroup
            defaultValue="mtn"
            onValueChange={handleMobileMoneyChange}
          >
            <div className="flex items-center gap-5 mt-5">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mtn" id="mtn" />
                <Label htmlFor="mtn">
                  <Image
                    src="/mtn.png"
                    alt="mtn logo"
                    width={80}
                    height={80}
                    className="aspect-video object-cover w-auto h-auto"
                  />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telecel" id="telecel" />
                <Label htmlFor="telecel">
                  <Image
                    src="/telecel.png"
                    alt="telecel logo"
                    width={80}
                    height={80}
                    className="aspect-video object-cover w-[150px] h-[75px] "
                  />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="atl" id="airtel" />
                <Label htmlFor="airtel">
                  <Image
                    src="/airtel.png"
                    alt="airtel logo"
                    width={80}
                    height={80}
                    className="aspect-video object-cover w-[150px] h-[75px] "
                  />
                </Label>
              </div>
            </div>
          </RadioGroup>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheckoutpaymentInfo;
