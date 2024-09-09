"use client";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormBuilder } from "@/components/blocks/formBuilder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";

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
        <FormBuilder name="email" label="email">
          <Input type="email" />
        </FormBuilder>
        <FormBuilder name="message" label="message" control={form.control}>
          <Textarea rows={8} className="resize-none" />
        </FormBuilder>
        <Button type="submit">Send</Button>
      </form>
    </Form>
  );
};

export default SendMessageForm;
