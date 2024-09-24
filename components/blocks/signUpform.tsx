"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { authenticate, State } from "@/lib/actions";
import { useFormState } from "react-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/lib/schema";
import { useState, useTransition } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Form } from "@/components/ui/form";
import { FormBuilderWithIcons } from "./formBuilder";
import { useCreateAccount } from "@/lib/formSubmissions";
import { Button } from "@/components/ui/button";

const PasswordIcon = ({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
}) => {
  return (
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
  );
};
const initialState: State = {
  message: "",
  errors: {},
};
const SignUpform = () => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
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
    console.log(data);
    startTransition(async () => {
      try {
        const { email, password } = data;
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        await onCreateAccount(data);
        formAction(formData);
      } catch (error) {
        console.error(error);
      }
    });
  };

  //form submission
  const { onCreateAccount } = useCreateAccount();
  return (
    <div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormBuilderWithIcons
            name="name"
            label="Full name"
            icon={<User />}
            description={"First name then other names"}
          >
            <Input className="pl-10" placeholder={"Enter your full name"} />
          </FormBuilderWithIcons>
          <FormBuilderWithIcons name="email" label="Email" icon={<Mail />}>
            <Input className="pl-10" placeholder={"Enter your email"} />
          </FormBuilderWithIcons>
          <FormBuilderWithIcons
            name="password"
            label="Password"
            icon={<Lock />}
            endIcon={
              <PasswordIcon
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            }
          >
            <Input
              type={showPassword ? "text" : "password"}
              className="pl-10 pr-10"
              placeholder="Enter your password"
            />
          </FormBuilderWithIcons>
          <FormBuilderWithIcons
            name="confirmPassword"
            label="Enter your password again"
            message
            icon={<Lock />}
            endIcon={
              <PasswordIcon
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            }
          >
            <Input
              type={showPassword ? "text" : "password"}
              className="pl-10 pr-10"
              placeholder="Enter your password"
            />
          </FormBuilderWithIcons>

          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            type="submit"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isPending}
          >
            Create account
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpform;
