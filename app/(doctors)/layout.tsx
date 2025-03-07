import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Fragment, ReactNode } from "react";

const Doctorslayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/sign-in");
  }
  if (session.user.role !== "doctor")
    return (
      <div className="flex min-h-screen justify-center items-center text-destructive">
            Unauthorized
      </div>
    );
  return <Fragment>{children}</Fragment>;
};

export default Doctorslayout;
