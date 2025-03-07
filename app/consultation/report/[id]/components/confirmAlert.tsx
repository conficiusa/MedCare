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
import { Session } from "next-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formSchema } from "./schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { ReactNode } from "react";

export function MedicalReportAlert({
  form,
  onSubmit,
  isOpen,
  setIsOpen,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const router = useRouter();

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Report</AlertDialogTitle>
          <AlertDialogDescription>
            By submitting, you confirm that this medical consultation report is
            accurate and complete to the best of your knowledge
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={form.formState.isSubmitting}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            I understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
