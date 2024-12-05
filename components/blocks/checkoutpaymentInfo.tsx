"use client";
import { CheckoutSchema } from "@/lib/schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import mtn from "@/public/mtn.png";
import telecel from "@/public/telecel.png";
import airtel from "@/public/airtel.png";
import visa from "@/public/visa.webp";

const providersImages = [
  { src: mtn, alt: "mtn logo" },
  { src: telecel, alt: "telecel logo" },
  { src: airtel, alt: "airtel logo" },
];
const cardProviders = [{ src: visa, alt: "visa logo" }];

const CheckoutpaymentInfo = ({
  form,
}: {
  form: UseFormReturn<z.output<typeof CheckoutSchema>>;
}) => {
  const handleTabChange = (value: string) => {
    form.setValue("channel", value as "mobile_money" | "card");
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
          <p className="text-sm border-1 my-2 text-muted-foreground">
            We support:
          </p>
          <div className="flex items-center gap-4">
            {providersImages.map((provider, index) => (
              <Image
                key={index}
                src={provider.src}
                alt={provider.alt}
                width={100}
                height={100}
                className="aspect-video object-cover rounded-lg hidden sm:block  h-auto "
              />
            ))}
            {providersImages.map((provider, index) => (
              <Image
                key={index}
                src={provider.src}
                alt={provider.alt}
                width={60}
                height={60}
                className="aspect-video object-cover rounded-lg hidden max-sm:block  h-auto"
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="card">
          <p className="text-sm border-1 my-2 text-muted-foreground">
            We support:
          </p>
          <div>
            {cardProviders.map((provider, index) => (
              <Image
                key={index}
                src={provider.src}
                alt={provider.alt}
                width={100}
                height={100}
                className="aspect-video object-cover rounded-lg hidden sm:block  h-auto "
              />
            ))}
            {cardProviders.map((provider, index) => (
              <Image
                key={index}
                src={provider.src}
                alt={provider.alt}
                width={60}
                height={60}
                className="aspect-video object-cover rounded-lg hidden max-sm:block  h-auto"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheckoutpaymentInfo;
