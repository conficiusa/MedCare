"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authenticate, State } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/schema";
import { useEffect } from "react";
import { toast } from "sonner";

const SubmitButton = ({ children }: { children: React.ReactNode }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      className="mt-6"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {children}
    </Button>
  );
};

const SignInform = () => {
  const initialState: State = {
    message: "",
    errors: {},
  };
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
        position: "top-right",
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
        <form action={formAction} className="grid gap-4">
          <FormBuilder name="email" label="Email" message={true}>
            <Input placeholder="enter your email" />
          </FormBuilder>
          <FormBuilder name="password" label="Password" message={true}>
            <Input placeholder="enter your password" type="password" />
          </FormBuilder>
          <SubmitButton>Login</SubmitButton>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm leading-8">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default SignInform;
