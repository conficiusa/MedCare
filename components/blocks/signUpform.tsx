"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateAccount } from "@/lib/formSubmissions";
import { useTransition } from "react";
import { authenticate, State } from "@/lib/actions";
import { useFormState } from "react-dom";

const initialState: State = {
  message: "",
  errors: {},
};
const SignUpform = () => {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useFormState(authenticate, initialState);

  //form initialization
  const form = useForm<z.output<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (data: z.output<typeof SignUpSchema>) => {
    startTransition(async () => {
      try {
        const { email, password } = data;
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        await onCreateAccount(data);
        formAction(formData);
      } catch (error) {
        console.error(error)
      }
    });
  };

  //form submission
  const { onCreateAccount } = useCreateAccount();
  return (
    <div>
      <Form {...form}>
        <form
          className="grid gap-2"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormBuilder
            name="name"
            label="Full name"
            message={true}
            description={"please input your first name first then other names"}
          >
            <Input placeholder="Full name" />
          </FormBuilder>
          <FormBuilder name="email" label="email" message={true}>
            <Input placeholder="email" type="email" />
          </FormBuilder>
          <FormBuilder name="password" label="Password" message={true}>
            <Input placeholder="enter your password" type="password" />
          </FormBuilder>
          <FormBuilder
            name="confirmPassword"
            label="Confirm Password"
            message={true}
          >
            <Input placeholder="confirm password" type="password" />
          </FormBuilder>
          <Button className="mt-6" type="submit" disabled={isPending}>
            Create Account
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpform;
