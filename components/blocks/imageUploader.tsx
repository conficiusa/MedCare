"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

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
  isCircular?: boolean;
  showControls?: boolean;
  onSave: (file: File) => Promise<void>;
  prevImage?: string;
}

export default function ImageUpload({
  label,
  id,
  image,
  setImage,
  disabled = false,
  isCircular = false,
  showControls = true,
  prevImage,
  onSave,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(add || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePreview = useCallback(() => {
    if (canvasRef.current && imageRef.current && containerRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const { naturalWidth: width, naturalHeight: height } = imageRef.current;
        const containerSize = containerRef.current.offsetWidth;
        canvasRef.current.width = containerSize;
        canvasRef.current.height = containerSize;

        const size = Math.min(width, height);
        const sx = (width - size) / 2;
        const sy = (height - size) / 2;

        ctx.save();
        ctx.clearRect(0, 0, containerSize, containerSize);
        ctx.translate(containerSize / 2, containerSize / 2);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.drawImage(
          imageRef.current,
          sx,
          sy,
          size,
          size,
          -containerSize / 2,
          -containerSize / 2,
          containerSize,
          containerSize
        );
        ctx.restore();

        setPreview(canvasRef.current.toDataURL("image/webp"));
      }
    }
  }, [scale, rotate]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          updatePreview();
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(image);
    } else if (prevImage) {
      setPreview(prevImage);
    } else {
      setPreview(null);
    }
  }, [image, prevImage, updatePreview]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error("File too large", {
            description: "Please upload an image smaller than 4MB.",
          });
          return;
        }

        if (!Object.keys(ACCEPTED_IMAGE_TYPES).includes(file.type)) {
          toast.error("Invalid file type", {
            description: "Please upload a JPEG, PNG, or WebP image.",
          });
          return;
        }

        setUploadProgress(0);
        const reader = new FileReader();
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress((event.loaded / event.total) * 100);
          }
        };
        reader.onloadend = () => {
          setUploadProgress(100);
          setImage(file);
          setScale(1);
          setRotate(0);
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [setImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    disabled,
  });

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    setUploadProgress(0);
    setScale(1);
    setRotate(0);
  };

  const handleSave = async () => {
    try {
      if (canvasRef.current && imageRef.current) {
        canvasRef.current.toBlob(
          async (blob) => {
            if (blob && image) {
              const newFile = new File([blob], image.name, {
                type: "image/webp",
              });
              setImage(newFile);
              await onSave(newFile);
            }
          },
          "image/webp",
          1
        );
        return "success";
      }
    } catch (error: any) {
      console.log(error);
      return error?.message;
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor={id}>{label}</Label>
      <div
        className={cn(
          "relative w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center overflow-hidden bg-muted transition-colors p-4",
          isDragActive && "border-primary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {preview ? (
          <div className="w-full flex flex-col items-center justify-center">
            <div
              ref={containerRef}
              className={cn(
                "relative w-64 h-64 mb-4 overflow-hidden",
                isCircular && "rounded-full"
              )}
            >
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            <div className="flex flex-col items-center space-y-4 w-full">
              {showControls && (
                <div className="flex space-x-2 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newScale = Math.max(scale - 0.1, 0.1);
                      setScale(newScale);
                      updatePreview();
                    }}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Slider
                    value={[scale]}
                    onValueChange={(value) => {
                      setScale(value[0]);
                      updatePreview();
                    }}
                    min={0.1}
                    max={3}
                    step={0.1}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newScale = Math.min(scale + 0.1, 3);
                      setScale(newScale);
                      updatePreview();
                    }}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newRotate = (rotate + 90) % 360;
                      setRotate(newRotate);
                      updatePreview();
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex space-x-2 justify-evenly">
                <Button
                  type="button"
                  onClick={() =>
                    toast.promise(handleSave, {
                      loading: "Uploading image...",
                      success: (data) => {
                        if (data === "success") {
                          return "upload successful";
                        } else {
                          throw new Error(data);
                        }
                      },
                      error: () => {
                        return "Failed to upload image";
                      },
                    })
                  }
                >
                  Upload Image
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={removeImage}
                  size={"icon"}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="w-full h-64 flex items-center justify-center"
          >
            <input {...getInputProps({ id })} />
            {uploadProgress > 0 && uploadProgress < 100 ? (
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <Progress value={uploadProgress} className="w-64 mx-auto" />
              </div>
            ) : (
              <div className="text-center p-4">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop your image here, or click to select
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPEG, PNG, WebP (max 4MB)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
