"use client";
import { PatientOnboardingSchema } from "@/lib/schema";
import * as React from "react";
import { motion } from "framer-motion";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

const OnboardingSummarypatient = ({
  form,
}: {
  form: UseFormReturn<z.output<typeof PatientOnboardingSchema>>;
}) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row items-center gap-8"
    >
      <div className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            You are almost done!!
          </CardTitle>
          <CardTitle className="text-2xl font-semibold text-primary">
            Summary
          </CardTitle>
          <CardDescription>
            Please review the information you have provided. Feel free to make
            any changes before you submit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 whitespace-break-spaces gap-6 place-items-start">
            <div className="grid gap-4 ">
              <CardTitle className="text-lg font-medium">
                Personal Information
              </CardTitle>
              <div>
                <span className="text-sm text-muted-foreground">Gender: </span>
                <p className="text-sm font-medium">
                  {form.watch("gender") || "Not available"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Date of birth:{" "}
                </span>
                <p className="text-sm font-medium">
                  {form.watch("dob")
                    ? form.watch("dob").toLocaleDateString()
                    : "Not available"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Contact: </span>
                <p className="text-sm font-medium">
                  {form.watch("phone") || "Not available"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Languages spoken:{" "}
                </span>
                <p className="text-sm font-medium">
                  {form
                    .watch("languages")
                    .map((lang: { label: string; value: string }) => lang.label)
                    .join(", ") || "Not available"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 items-start">
              <CardTitle className="text-lg font-medium">
                Location & Address
              </CardTitle>
              <div>
                <span className="text-sm text-muted-foreground">Region: </span>
                <p className="text-sm font-medium">
                  {form.watch("region") || "Not available"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  City/Town:{" "}
                </span>
                <p className="text-sm font-medium">
                  {form.watch("city") || "Not available"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Digital Address:{" "}
                </span>
                <p className="text-sm font-medium">
                  {form.watch("digitalAddress") || "Not available"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Languages spoken:{" "}
                </span>
                <p className="text-sm font-medium">
                  {form
                    .watch("languages")
                    .map((lang: { label: string; value: string }) => lang.label)
                    .join(", ") || "Not available"}
                </p>
              </div>
            </div>
            <div className="grid gap-4 items-start">
              <CardTitle className="text-lg font-medium">
                Location & Address
              </CardTitle>
              <div>
                <span className="text-sm text-muted-foreground">
                  Relevant Conditions:{" "}
                </span>
                <p className="text-sm font-medium">
                  {form
                    .watch("conditions")
                    .map((lang: { label: string; value: string }) => lang.label)
                    .join(", ") || "Not available"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Additional info on medical history:
                </span>
                <p className="text-sm font-medium">
                  {form.watch("medicalHistory") || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default OnboardingSummarypatient;
