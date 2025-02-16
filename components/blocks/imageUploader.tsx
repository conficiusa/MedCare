"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

interface ImageUploadProps {
  label: string;
  id: string;
  image: File | null;
  setImage: (image: File | null) => void;
  disabled?: boolean;
  existingImageUrl?: string;
  onSave: (file: File) => Promise<void>;
}

export default function ImageUpload({
  label,
  id,
  onSave,
  existingImageUrl,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
    setFile(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <>
      <div className="space-y-4">
        <Label htmlFor={id}>{label}</Label>
        <div
          className={cn(
            "relative w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center overflow-hidden bg-muted transition-colors p-4 max-sm:px-1",
            isDragActive && "border-primary"
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {preview ? (
            <>
              <div className="relative">
                <Image
                  src={preview || existingImageUrl || ""}
                  alt="Preview"
                  width={300}
                  height={250}
                  className="mx-auto rounded-lg object-cover "
                />
              </div>
            </>
          ) : (
            <>
              <div className="text-center p-4 h-300px">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop your image here, or click to select
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPEG, PNG, WebP (max 4MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {file && (
        <Button
          className="w-full mt-3"
          onClick={async () => {
            if (!file) throw new Error("No file selected");
            toast.promise(onSave(file), {
              loading: "Uploading image...",
              success: "Image uploaded successfully",
              error: "An error occurred while uploading the image",
            });
          }}
          type="button"
        >
          Save & Continue
        </Button>
      )}
    </>
  );
}
