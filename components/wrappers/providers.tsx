"use client";
import { addMaximumScaleToMetaViewport, checkIsIOS } from "@/lib/utils";
import { useEffect } from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (checkIsIOS()) {
      addMaximumScaleToMetaViewport();
    }
  }, []);
  return <>{children}</>;
};

export default Providers;
