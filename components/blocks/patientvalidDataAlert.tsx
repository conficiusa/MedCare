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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form } from "../ui/form";
import { sendEmailAction } from "@/lib/actions";
import { PatientOnboardStepFour } from "@/lib/onboardingPatientactions";
import { patientOnboardemail } from "@/lib/emails";

export function PatientOnboardingAlert({
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
      const res = await PatientOnboardStepFour(data);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          await update({
            ...session,
            user: {
              ...session.user,
              onboarding_level: res?.data?.onboarding_level,
            },
          });
          toast.success("Welcome to Medcare Hub", {
            description:
              "Enjoy expert healthcare from the comfort of your home",
          });
          await sendEmailAction(
            "email",
            session?.user?.email as string,
            "Welcome to medcare hub",
            patientOnboardemail(session?.user?.name as string)
          );
          router.push("/find-a-doctor");
        }
      } else {
        toast.success("Failed", {
          description: "If the error persist contact us",
        });
      }
    } catch (error: any) {
      console.error(error);
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
              <AlertDialogTitle>Disclaimer</AlertDialogTitle>
              <AlertDialogDescription>
                By completing the onboarding process, you confirm that all
                information provided is accurate and truthful to the best of
                your knowledge. Medcare Hub will not be held liable for any
                consequences, mishaps, or legal actions resulting from
                inaccurate, incomplete, or fraudulent information submitted
                during onboarding. It is your responsibility to ensure the
                integrity of the data provided.
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
