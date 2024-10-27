"use client";
import { CheckoutSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CheckoutContactInfo from "@/components/blocks/checkoutContactInfo";
import { Form } from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import CheckoutpaymentInfo from "@/components/blocks/checkoutpaymentInfo";
import { Button } from "@/components/ui/button";
import { handlePaystackPayment } from "@/lib/formSubmissions";
import { formatCurrency } from "@/lib/utils";
import { Banknote } from "lucide-react";

const CheckOutForm = ({ rate }: { rate: number }) => {
  const { data: session } = useSession();
  const form = useForm<z.output<typeof CheckoutSchema>>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      fullName: session?.user?.name || "",
      email: session?.user?.email || "",
      channel: "mobile_money",
      mobileMoneyType: "mtn",
      amount: rate,
    },
  });
  useEffect(() => {
    if (session) {
      form.setValue("fullName", session?.user?.name ?? "");
      form.setValue("email", session?.user?.email ?? "");
    }
  }, [session]);
  useEffect(() => {
    if (rate) {
      form.setValue("amount", rate);
    }
  }, [rate, form]);

  const handleSubmit = async (data: z.output<typeof CheckoutSchema>) => {
    try {
      await handlePaystackPayment(data);
    } catch (error: any) {
      console.error(error);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form className="grid md:gap-10 gap-6">
          <CheckoutContactInfo form={form} />
          <CheckoutpaymentInfo form={form} />
          <div className="mt-6">
            <Button
              onClick={form.handleSubmit(handleSubmit)}
              className="font-bold w-full flex justify-center gap-2 "
              disabled={form.formState.isSubmitting}
            >
              <Banknote /> Pay {formatCurrency(rate as number)}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CheckOutForm;
