"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authenticate, State } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/schema";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { FormBuilderWithIcons } from "./formBuilder";
import { cn } from "@/lib/utils";

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
const initialState: State = {
  message: "",
  errors: {},
};
const SignInform = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useFormState(authenticate, initialState);

  const form = useForm<z.output<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (state?.message) {
      toast.error(state?.message, {
        position: "top-left",
      });
    }
  }, [state, state?.message]);

  useEffect(() => {
    if (state?.errors && Object.keys(state?.errors).length > 0) {
      Object.keys(state.errors).forEach((field) => {
        const errorMessage =
          state.errors![field as keyof typeof state.errors]?.[0]; // Get the first error message
        if (errorMessage) {
          form.setError(field as keyof z.output<typeof SignInSchema>, {
            type: "manual",
            message: errorMessage,
          });
        }
      });
    }
  }, [state, state?.errors, form]);

  return (
    <div>
      <Form {...form}>
        <form className="space-y-4" action={formAction}>
          <FormBuilderWithIcons name="email" label="Email" icon={<Mail />}>
            <Input className="pl-10" placeholder={"Enter your email"} />
          </FormBuilderWithIcons>
          <FormBuilderWithIcons
            name="password"
            label="Password"
            icon={<Lock />}
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            }
          >
            <Input
              type={showPassword ? "text" : "password"}
              className="pl-10 pr-10"
              placeholder="Enter your password"
            />
          </FormBuilderWithIcons>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-green-600"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              href="#"
              className="text-sm text-green-600 hover:text-green-500"
            >
              Forgot password?
            </Link>
          </div>
          <SubmitButton className="w-full bg-green-600 hover:bg-green-700 text-white">
            Sign in
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default SignInform;
