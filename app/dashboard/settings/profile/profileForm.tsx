"use client";
import { FormBuilder } from "@/components/blocks/formBuilder";
import SelectComponent from "@/components/blocks/selectComponent";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { languages, regions } from "@/lib/data";
import { fullPatientSchema } from "@/lib/schema";
import { getFilteredValues } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DatePickerForm from "@/components/blocks/dobpicker";
import MultiSelector from "@/components/blocks/multipleSelector";
import { toast } from "sonner";
import ImageUpload from "@/components/blocks/imageUploader";
import { upload } from "@/lib/actions";
import { ProfilePicturesFolder } from "@/lib/constants";

const ProfileForm = ({ session }: { session: Session }) => {
  const [image, setImage] = React.useState<File | null>(null);
  const prevImage = session?.user?.image?.includes("vercel")
    ? session?.user?.image
    : null;
  const form = useForm<z.output<typeof fullPatientSchema>>({
    resolver: zodResolver(fullPatientSchema),
    defaultValues: {
      address_1: session?.user?.address_1 ?? "",
      address_2: session?.user?.address_2 ?? "",
      city: session?.user?.city ?? "",
      country: "Ghana",
      dob: new Date(session?.user?.dob as Date) ?? undefined,
      gender: session?.user?.gender ?? "",
      phone: session?.user?.phone ?? "",
      role: "patient",
      region: session?.user?.region ?? "",
      languages: getFilteredValues(session?.user?.languages, languages),
      name: session?.user?.name ?? "",
      image: session?.user?.image ?? "",
      thumbnail: session?.user?.thumbnail ?? "",
    },
  });

  const onSave = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await upload(formData, ProfilePicturesFolder);
    if ("data" in response) {
      form.setValue("image", response?.data.url);
    } else {
      throw new Error("An error occurred while uploading the image");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="dark:bg-muted/40 bg-muted/70 p-10 rounded-2xl shadow-md flex gap-20">
          <div className="grid gap-4 flex-1">
            <h2 className="text-xs uppercase text-muted-foreground">
              Basic Information
            </h2>
            <FormBuilder name="name" label="Full Name" message>
              <Input id="name" placeholder="Name" />
            </FormBuilder>
            <SelectComponent
              name="gender"
              label="Select Your Gender"
              placeholder="Select Your Gender"
              items={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
              ]}
            />
            <MultiSelector
              defaultOptions={languages}
              form={form}
              name="languages"
              empty="No languages found"
              label="What languages do you speak?"
              placeholder="Select languages"
              groupBy="group"
              maxSelected={4}
              onMaxSelected={(maxlimit) => {
                toast.info(`you have reached the maximum limit of ${maxlimit}`);
              }}
            />
            <FormBuilder name="phone" label="Enter your Contact ">
              <PhoneInput
                type="text"
                placeholder="Phone number"
                className="duration-300"
                defaultCountry="GH"
                international={false}
                initialValueFormat="national"
              />
            </FormBuilder>
            <DatePickerForm
              name="dob"
              control={form.control}
              label="Choose your date of birth"
            />
          </div>
        </div>
        <div className="dark:bg-muted/40 bg-muted/70 p-10 rounded-2xl shadow-md grid gap-4">
          <h2 className="text-xs uppercase text-muted-foreground">
            Location and address details
          </h2>
          <FormBuilder name="address_1" label="Address Line 1" message>
            <Input id="address_1" placeholder="Address Line 1" />
          </FormBuilder>
          <FormBuilder name="address_2" label="Address Line 2" message>
            <Input id="address_2" placeholder="Address Line 2" />
          </FormBuilder>
          <FormBuilder name="city" label="City" message>
            <Input id="city" placeholder="City" />
          </FormBuilder>
          <SelectComponent
            name="region"
            label="Choose your region"
            placeholder="Select region"
            items={regions}
            control={form.control}
          />
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
