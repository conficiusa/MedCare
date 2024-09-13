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

const SignUpform = () => {
  //form initialization
  const form = useForm<z.output<typeof SignUpSchema>>({
    // resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  //form submission
  const { onCreateAccount } = useCreateAccount();
  return (
    <div>
      <Form {...form}>
        <form
          className="grid gap-2"
          onSubmit={form.handleSubmit(onCreateAccount)}
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
          <Button className="mt-6" type="submit">
            Create Account
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpform;
