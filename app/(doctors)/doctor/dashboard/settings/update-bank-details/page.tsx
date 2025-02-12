import React from "react";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VerificationCard from "./request-verification";
import BankUpdateForm from "./bank-update";
import { fetchUserData } from "@/lib/queries";

const page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  const user = await fetchUserData(session?.user?.id ?? "");
  if (!("data" in user)) return;

  const cookieStore = cookies();
  const token = cookieStore.get("bankToken");
  return (
    <>
      {token ? (
        <main className="p-8">
          <div className="mb-4 space-y-2">
            <h1 className="text-3xl font-semibold capitalize ">
              Update Bank Details
            </h1>
            <p className="text-muted-foreground text-sm">
              Update your bank date and your rate. This information is required
              to process your payments.
            </p>
          </div>
          <div>
            <BankUpdateForm user={user?.data} />
          </div>
        </main>
      ) : (
        <VerificationCard />
      )}
    </>
  );
};

export default page;
