"use client";
import { ImageUploader } from "@/components/blocks/ImageUpload";
import { useForm, UseFormReturn } from "react-hook-form";
import { fullPatientSchema } from "@/lib/schema";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { PatientProfileUpdate } from "@/lib/onboardingPatientactions";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFilteredValues } from "@/lib/utils";
import { languages } from "@/lib/data";

export default function ProfilePic({
  initialImage,
}: {
  initialImage: string | null;
}) {
  const { update, data: session } = useSession();
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

  const handleImageChange = async (response: {
    originalUrl: string;
    thumbnailUrl: string;
  }) => {
    if (!response) return;
    form.setValue("image", response?.originalUrl);
    form.setValue("thumbnail", response?.thumbnailUrl);

    await form.handleSubmit(handleSubmit)();
  };
  const handleSubmit = async (data: z.output<typeof fullPatientSchema>) => {
    try {
      const res = await PatientProfileUpdate(data);
      if ("data" in res) {
        console.log(res);
        if (res?.statusCode === 200) {
          await update({
            ...session,
            user: {
              ...session?.user,
              image: res?.data?.image,
              onboarding_level: res?.data?.doctorInfo?.onboarding_level,
              doctorInfo: {
                ...session?.user?.doctorInfo,
                onboarding_level: res?.data?.doctorInfo.onboarding_level,
              },
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred while uploading the image");
    }
  };

  return (
    <ImageUploader
      initialImage={initialImage ?? ""}
      onImageChange={handleImageChange}
    />
  );
}
