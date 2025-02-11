import React from "react";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VerificationCard from "./request-verification";

const page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  const cookieStore = cookies();
  const token = cookieStore.get("bankToken");
  return (
    <>
      {token ? (
        <main className="p-4">
          <h1 className="text-3xl font-semibold capitalize">
            Update Bank Details
          </h1>
        </main>
      ) : (
        <VerificationCard />
      )}
    </>
  );
};

export default page;
