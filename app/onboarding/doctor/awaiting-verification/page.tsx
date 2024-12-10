"use client";
import { TooltipBuilder } from "@/components/blocks/tooltipBuilder";
import { Button } from "@/components/ui/button";
import { verifyDoctorAccount } from "@/lib/actions";
import { DoctorOnboardStepSix } from "@/lib/onboarding";
import { onDoctorBoardingSchema6 } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Edit2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function VerificationPage() {
  const { data: authSession, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!authSession) {
      router.push("/sign-in");
    }
  }, [authSession, router]);
  // TODO:  IN PRODUCTION, REMOVE THE TEST VERIFICATION BUTTON

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
      const res = await DoctorOnboardStepSix(data, 6);
      if ("data" in res) {
        if (res?.statusCode === 200) {
          await update({
            ...authSession,
            user: {
              ...authSession?.user,
              onboarding_level: res?.data?.onboarding_level,
              doctorInfo: {
                ...authSession?.user?.doctorInfo,
                onboarding_level: res?.data?.doctorInfo?.onboarding_level,
                verification: res?.data?.doctorInfo?.onboarding_level,
              },
            },
          });
          router.push("/onboarding/doctor");
        }
      } else {
        toast.error("Your cannot update your profile at this moment");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-background p-4">
      <div className="w-full max-w-md bg-background dark:bg-muted/40 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-20 h-20 mb-2">
            <div className="absolute inset-0 bg-background rounded-full" />
            <div className="absolute inset-1 bg-background rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="w-10 h-10 text-primary" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-center">
            Verification in Progress
          </h1>

          <p className="text-gray-500 text-center">
            We&apos;re reviewing your credentials and documentation. Further
            communication will be through your registered email.
          </p>

          <div className="flex gap-2 items-end">
            <Button className="mt-4 rounded-full" variant={"outline"}>
              Return to Homepage
            </Button>
            <TooltipBuilder content="Update onboarding data">
              <Button
                size={"icon"}
                variant={"outline"}
                className="rounded-lg"
                onClick={form.handleSubmit(handleSubmit)}
              >
                <Edit2 className="w-5 h-5" />
              </Button>
            </TooltipBuilder>
          </div>
          <Button
            className="rounded-full"
            onClick={() =>
              toast.promise(
                verifyDoctorAccount(authSession?.user?.id as string),
                {
                  loading: "Verifying account..",
                  success: async (data) => {
                    if (data.status === "success") {
                      await update({
                        ...authSession,
                        user: {
                          ...authSession?.user,
                          doctorInfo: {
                            ...authSession?.user?.doctorInfo,
                            verification: "approved",
                          },
                        },
                      });
                      router.push("/doctor/dashboard/schedule");
                      return "Account verified Sucessfully";
                    }
                    throw new Error(data?.message);
                  },
                  error: (error: any) => {
                    return error?.message;
                  },
                  description: (data) => {
                    if (data?.status === "success") {
                      return "Your profile will now be available for appointments. Welcome to medcare hub";
                    }
                    return "You account could not be verified at this moment. try again later ";
                  },
                }
              )
            }
          >
            Test Verification for Development
          </Button>
        </div>
      </div>
    </div>
  );
}
