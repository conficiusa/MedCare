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
      verification: "verifying",
    },
  });

  const handleSubmit = async (
    data: z.output<typeof onDoctorBoardingSchema6>
  ) => {
    try {
      const res = await DoctorOnboardStepSix(data, 7);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          await update({
            ...session,
            user: {
              ...session.user,
              onboarding_level: res?.data?.onboarding_level,
              doctorInfo: {
                ...session?.user?.doctorInfo,
                onboarding_level: res?.data?.doctorInfo?.onboarding_level,
                verification: res?.data?.doctorInfo?.onboarding_level,
              },
            },
          });
          return res;
        }
      } else {
        return res;
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const finishUp = async (data: z.output<typeof onDoctorBoardingSchema6>) => {
    const response = await handleSubmit(data);

    if (response?.status === "fail") {
      form.setValue("verification", "not_started");
      throw new Error(response?.message);
    }

    return response;
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
              <AlertDialogTitle>Disclaimer</AlertDialogTitle>
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
                onClick={form.handleSubmit((data) =>
                  toast.promise(finishUp(data), {
                    loading: "Setting up your accounts...",
                    success: (res) => {
                      if (res?.statusCode === 200) {
                        router.push("/dashboard");
                        return "We will verify your information and get back to you.";
                      } else {
                        throw new Error("Failed to complete onboarding");
                      }
                    },
                    error: (error) => error.message,
                  })
                )}
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
