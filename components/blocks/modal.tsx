"use client";

import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    router.back();
  };
  return (
    <Dialog defaultOpen={true} open={open} onOpenChange={handleOpenChange}>
      <DialogOverlay>
        <DialogContent className="overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>Sign In</DialogDescription>
          </DialogHeader>
          <ScrollArea className="w-full max-h-[80dvh]">{children}</ScrollArea>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default Modal;
