"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { onDoctorBoardingSchema6 } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdateSession } from "next-auth/react";
import { Session } from "next-auth";
import { Doctor } from "@/lib/definitions";
import { DoctorOnboardStepSix } from "@/lib/onboarding";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form } from "../ui/form";

export function OnboardingAlert({
  update,
  session,
}: {
  update: UpdateSession;
  session: Session;
}) {
  const router = useRouter();
  const form = useForm<z.output<typeof onDoctorBoardingSchema6>>({
    resolver: zodResolver(onDoctorBoardingSchema6),
    defaultValues: {
      verification: "not_started",
    },
  });

  const handleSubmit = async (
    data: z.output<typeof onDoctorBoardingSchema6>
  ) => {
    try {
      const res = await DoctorOnboardStepSix(data);
      console.log("res", res);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          await update({
            ...session,
            user: {
              ...session.user,
              doctorInfo: {
                ...session?.user?.doctorInfo,
                onboarding_level: res?.data?.doctorInfo?.onboarding_level,
                verification:res?.data?.doctorInfo?.onboarding_level
              },
            },
          });
          toast.success("Onboarding request received", {
            description: "We will verify your data and activate your account",
          });
          router.push("/onboarding/doctor/awaiting-verification");
        }
      } else {
        toast.success("Failed", {
          description: "If the error persist contact us",
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const finishUp = async (data: z.output<typeof onDoctorBoardingSchema6>) => {
    form.setValue("verification", "verifying");
    await handleSubmit(data);
  };
  return (
    <Form {...form}>
      <form>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full">Finish up</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Providing false or fraudulent information during the onboarding
                process is strictly prohibited. Such actions may result in the
                immediate suspension of your account and could lead to legal
                prosecution under applicable laws.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => form.handleSubmit(finishUp)()}
                disabled={form.formState.isSubmitting}
              >
                I understand
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
}
