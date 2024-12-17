import { auth } from "@/auth";
import AccountTypeForm from "@/components/blocks/accountTypeForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function AccountTypeSelection() {
  const authsession = await auth();
  if (!authsession) {
    redirect("/sign-in");
  }

  if (authsession?.user?.role === "doctor") {
    redirect("/onboarding/doctor");
  } else if (authsession?.user?.role === "patient") {
    redirect("/onboarding/patient");
  }
  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-50 via-purple-50 to-blue-50 flex items-center justify-center p-4 -mt-14 dark:bg-background dark:from-background dark:to-background dark:via-background">
      <Card className="w-full max-w-md dark:bg-muted/30 bg-background">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign up as:
          </CardTitle>
          <CardDescription className="text-center">
            Choose the type of account you want to create
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountTypeForm />
        </CardContent>
      </Card>
    </div>
  );
}
