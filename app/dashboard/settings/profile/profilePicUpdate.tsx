"use client";
import { ImageUploader } from "@/components/blocks/ImageUpload";
import { UseFormReturn } from "react-hook-form";
import { fullPatientSchema } from "@/lib/schema";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { PatientProfileUpdate } from "@/lib/onboardingPatientactions";

export default function ProfilePic({
  initialImage,
  form,
}: {
  initialImage: string | null;
  form: UseFormReturn<z.output<typeof fullPatientSchema>>;
}) {
  const { update, data: session } = useSession();
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
