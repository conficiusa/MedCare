"use client";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  FormBuilder,
  FormBuilderWithIcons,
} from "@/components/blocks/formBuilder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { AtSign } from "lucide-react";

const SendMessageForm = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      message: "",
    },
  });

  return (
    <Form {...form}>
      <form className="grid gap-4">
        <FormBuilderWithIcons
          name="email"
          label="email"
          icon={<AtSign />}
          description={
            "We will reply your any questions you have through your email"
          }
          descriptionClassName="font-light text-sm"
        >
          <Input type="email" placeholder="Your email" className="pl-10" />
        </FormBuilderWithIcons>
        <FormBuilder name="message" label="message" control={form.control}>
          <Textarea
            rows={8}
            className="resize-none"
            placeholder="leave your message"
          />
        </FormBuilder>
        <Button type="submit">Send</Button>
      </form>
    </Form>
  );
};

export default SendMessageForm;
