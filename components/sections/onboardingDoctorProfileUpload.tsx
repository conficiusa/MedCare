import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ImageUpload from "@/components/blocks/imageUploader";
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
      const res = await DoctorOnboardStepFive(data);
      console.log(res);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          await update({
            ...session,
            user: {
              ...session.user,
              image: res?.data?.image,
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
      console.log(error);
      throw new Error("An error occurred while uploading the image");
    }
  };

  const onSave = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await upload(formData);
    if ("data" in response) {
      console.log(response);
      form.setValue("image", response?.data.url);
      form.handleSubmit(handleSubmit)();
    } else {
      throw new Error("An error occurred while uploading the image");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
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
            isCircular={false}
            showControls={false}
            onSave={onSave}
            prevImage={prevImage as string}
          />
        </form>
      </CardContent>
    </Card>
  );
}
