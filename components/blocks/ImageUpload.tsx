"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { UploadDialog } from "./imageUploadDialog";
import { Camera } from "lucide-react";
interface ImageUploaderProps {
  initialImage?: string;
  onImageChange: (image: string | null) => void;
}

export function ImageUploader({
  initialImage,
  onImageChange,
}: ImageUploaderProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer relative group ">
            {initialImage ? (
              <Image
                src={initialImage}
                alt="Uploaded image"
                width={128}
                height={128}
                className="rounded-full aspect-square object-cover transition-opacity group-hover:opacity-75 dark:bg-background"
              />
            ) : (
              <div className="w-[121px] h-[121px]  rounded-full  flex items-center justify-center text-muted-foreground transition-colors group-hover:bg-gray-200 dark:group-hover:bg-background/40 dark:bg-muted">
                <Camera />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className=" bg-black bg-opacity-50  px-2 py-1 rounded">
                <Camera className="size-4" />
              </span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <UploadDialog onImageChange={onImageChange}/>
        </DialogContent>
      </Dialog>
    </>
  );
}
