"use client";
import { ImageUploader } from "@/components/blocks/ImageUpload";
import { useForm } from "react-hook-form";
import { onDoctorBoardingSchema5 } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DoctorOnboardStepFive } from "@/lib/onboarding";
import { useSession } from "next-auth/react";

export default function ProfilePic() {
  const { update, data: session } = useSession();
  const form = useForm<z.output<typeof onDoctorBoardingSchema5>>({
    resolver: zodResolver(onDoctorBoardingSchema5),
    defaultValues: {
      image: session?.user.image ?? "",
      thumbnail: session?.user.thumbnail ?? "",
    },
  });

  const handleImageChange = async (newImage: string | null) => {
    if (!newImage) return;
    form.setValue("image", newImage);
    await form.handleSubmit(handleSubmit)();
  };
  const handleSubmit = async (
    data: z.output<typeof onDoctorBoardingSchema5>
  ) => {
    try {
      const res = await DoctorOnboardStepFive(data, 7);
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
      initialImage={session?.user.image ?? ""}
      onImageChange={handleImageChange}
    />
  );
}
