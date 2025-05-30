"use client";
import SignInimage from "@/components/blocks/signInimage";
import AnimationWrapper from "@/components/wrappers/animationWrapper";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[100dvh] bg-gray-100 dark:bg-background flex items-center justify-center p-4">
      <AnimationWrapper className="w-full max-w-6xl">
        <div className="bg-white dark:bg-muted/40 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {children}
          <SignInimage />
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default AuthLayout;
