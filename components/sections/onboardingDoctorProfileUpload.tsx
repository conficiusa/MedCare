import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { upload } from "@/lib/actions";
import { z } from "zod";
import { onDoctorBoardingSchema5 } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Step } from "../blocks/onboardingDoctor";
import { DoctorOnboardStepFive } from "@/lib/onboarding";
import { Doctor } from "@/lib/definitions";
import { Session } from "next-auth";
import { UpdateSession } from "next-auth/react";
import ImageUpload from "@/components/blocks/imageUploader";
import { ProfilePicturesFolder } from "@/lib/constants";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function DoctorImageUpload({
  currentStep,
  setCurrentStep,
  steps,
  user,
  update,
  session,
}: {
  currentStep: Step;
  steps: Step[];
  setCurrentStep: (step: Step) => void;
  user: Doctor;
  session: Session;
  update: UpdateSession;
}) {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const form = useForm<z.output<typeof onDoctorBoardingSchema5>>({
    resolver: zodResolver(onDoctorBoardingSchema5),
    defaultValues: {
      image: user?.image?.includes("vercel") ? user?.image : "",
    },
  });
  const prevImage = user?.image?.includes("vercel") ? user?.image : null;

  const handleSubmit = async (
    data: z.output<typeof onDoctorBoardingSchema5>
  ) => {
    try {
      const res = await DoctorOnboardStepFive(data, 6);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          await update({
            ...session,
            user: {
              ...session.user,
              image: res?.data?.image,
              thumbnail: res?.data?.thumbnail,
              onboarding_level: res?.data?.doctorInfo?.onboarding_level,
              doctorInfo: {
                ...session?.user?.doctorInfo,
                onboarding_level: res?.data?.doctorInfo.onboarding_level,
              },
            },
          });
          const currentIndex = steps.indexOf(currentStep);
          setCurrentStep(steps[currentIndex + 1]);
        }
      } else {
        throw new Error("An error occurred while uploading the image");
      }
    } catch (error: any) {
      console.error(error);
      throw new Error("An error occurred while uploading the image");
    }
  };

  const onSave = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/user/update/image-processing", {
      method: "POST",
      body: formData,
    });
    const response = await res.json();
    if (res?.status !== 200) {
      toast.error("An error occurred while uploading the image");
      throw new Error("An error occurred while uploading the image");
    }
    form.setValue("image", response?.originalUrl);
    form.setValue("thumbnail", response?.thumbnailUrl);
    form.handleSubmit(handleSubmit)();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto max-sm:px-1">
      <CardHeader>
        <CardTitle>Upload a professional image</CardTitle>
        <CardDescription>
          This picture will be shown on your profile page for patients who
          visit. It should be a professional image of you. The image will also
          be used in verifying your identity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-8">
          <ImageUpload
            label="Profile Picture"
            id="profileImage"
            image={profileImage}
            setImage={setProfileImage}
            onSave={onSave}
            existingImageUrl={prevImage as string}
          />
        </form>
      </CardContent>
    </Card>
  );
}
