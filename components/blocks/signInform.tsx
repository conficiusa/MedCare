"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignInform = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div>
      <Form {...form}>
        <form action="" className="grid gap-4">
          <FormBuilder name="email" label="Email" message={true}>
            <Input placeholder="enter your email" />
          </FormBuilder>
          <FormBuilder name="password" label="Password" message={true}>
            <Input placeholder="enter your password" type="password" />
          </FormBuilder>
          <Button className="mt-6" type="submit">
            Log in
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignInform;
