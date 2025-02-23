"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash, X } from "lucide-react";
import { ProfilePicturesFolder } from "@/lib/constants";
import { upload } from "@/lib/actions";
import { toast } from "sonner";

interface UploadDialogProps {
  onImageChange: (response: {
    originalUrl: string;
    thumbnailUrl: string;
  }) => void;
  setOpen: (open: boolean) => void;
  setOptimisticImage: (image: string | null) => void;
}

export function UploadDialog({
  onImageChange,
  setOpen,
  setOptimisticImage,
}: UploadDialogProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setOptimisticImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    },
    [setOptimisticImage, setOpen]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
  });

  const handleSave = useCallback(async () => {
    if (!file) throw new Error("No file selected");
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
    onImageChange(response);
    setOpen(false);
  }, [file, onImageChange, setOptimisticImage]);

  const handleClear = useCallback(() => {
    setPreview(null);
    setFile(null);
  }, []);

  return (
    <div className="p-4">
      <DialogHeader>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogDescription>
          Drag and drop an image or click to select a file.
        </DialogDescription>
      </DialogHeader>
      <div
        {...getRootProps()}
        className={`mt-4 border-2 border-dashed max-h-[60dvh] rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted hover:border-primary/50"
        } `}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              width={200}
              priority
              height={200}
              className="mx-auto rounded-lg object-cover "
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              {isDragActive
                ? "Drop the image here"
                : "Drag an image here or click to select"}
            </p>
          </div>
        )}
      </div>

      {preview && (
        <DialogFooter>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClear}>
              Clear <Trash className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button
              onClick={() =>
                toast.promise(handleSave, {
                  loading: "Uploading Image",
                  error: (error) => {
                    setOptimisticImage(null);
                    return (
                      error.message ||
                      "An error occurred while uploading the image"
                    );
                  },
                  success: "Image uploaded successfully",
                })
              }
              disabled={!preview}
              className="flex-1"
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      )}
    </div>
  );
}
