"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { emailAuth } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/schema";
import { useTransition } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { FormBuilderWithIcons } from "./formBuilder";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export const SubmitButton = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      className={cn("", className)}
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {children}
    </Button>
  );
};

const SignInform = () => {
  const callbackUrl = useSearchParams().get("redirect");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.output<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSignIn = async (data: z.output<typeof SignInSchema>) => {
    const res = await emailAuth(data, callbackUrl);
    startTransition(async () => {
      if ("type" in res) {
        toast.error(res.type, {
          description: res.message,
        });
      }
    });
  };

  
  return (
    <div>
      <Form {...form}>
        <form className="space-y-10" onSubmit={form.handleSubmit(handleSignIn)}>
          <FormBuilderWithIcons name="email" label="Email" icon={<Mail />}>
            <Input className="pl-10" placeholder={"Enter your email"} />
          </FormBuilderWithIcons>
          <Button
            className="w-full mt-5"
            disabled={form.formState.isSubmitting || isPending}
          >
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignInform;
