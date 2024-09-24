"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Upload, X, Edit2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { PatientOnboardingSchema } from "@/lib/schema";
import { z } from "zod";
import validateStep from "@/hooks/validateStep";
import { Step } from "@/app/onboarding/patient/page";

export default function ProfileUpload({
  form,
  steps,
  setCurrentStep,
}: {
  form: UseFormReturn<z.output<typeof PatientOnboardingSchema>>;
  steps: Step[];
  setCurrentStep: (step: Step) => void;
}) {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInput = form.watch("image");

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please upload an image file.",
        });
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please upload an image smaller than 4MB.",
        });
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      const reader = new FileReader();
      reader.onloadstart = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
          }
        }, 100);
      };
      reader.onloadend = async () => {
        form.setValue("image", reader.result as string);
        const isValid = await validateStep(form, "image");
        console.log(isValid);
        if (!isValid) {
          console.log(form.formState.errors.image);
          toast.error(form.formState.errors.image?.message);
          form.setValue("image", null);
          return;
        }
        setProfilePicture(reader.result as string);
        setIsUploading(false);
        setUploadProgress(100);
      };
      reader.readAsDataURL(file);
    },
    [form]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const removeProfilePicture = useCallback(() => {
    form.setValue("image", null);
    setProfilePicture(null);
    setUploadProgress(0);
  }, [form]);

  useEffect(() => {
    if (imageInput) {
      if (!profilePicture) {
        const imageFile = imageInput;
        if (imageFile) {
          setProfilePicture(imageFile);
        }
      }
    }
  }, [imageInput, profilePicture]);

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <Label htmlFor="profilePicture" className="text-lg font-semibold">
        Profile Picture
      </Label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          {...form.register("image", {
            onChange: handleFileChange,
          })}
          ref={fileInputRef}
        />
        <AnimatePresence mode="wait">
          {profilePicture ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative inline-block"
            >
              <Avatar className="w-40 h-40 mx-auto">
                <AvatarImage src={profilePicture} alt="Profile" />
                <AvatarFallback>
                  <User className="w-20 h-20 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full">
                <div className="space-x-2 space-y-2">
                  <Button
                    size="sm"
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-gray-800"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    type="button"
                    onClick={removeProfilePicture}
                    className="bg-white text-red-600 hover:text-white"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex justify-center">
                <Avatar className="w-40 h-40">
                  <AvatarFallback>
                    <User className="w-20 h-20 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Drag and drop your profile picture here, or click to select a
                  file
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mx-auto"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className="bg-green-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Uploading... {uploadProgress}%
            </p>
          </motion.div>
        )}
        {uploadProgress === 100 && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-green-600 flex items-center justify-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Upload complete!</span>
          </motion.div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          className="w-full"
          type="button"
          onClick={() => {
            setCurrentStep(steps[steps.indexOf("profile") + 1]);
          }}
        >
          {profilePicture ? "Continue" : "Skip for now"}
        </Button>
      </motion.div>
    </div>
  );
}
