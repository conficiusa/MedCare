import AccountTypeForm from "@/components/blocks/accountTypeForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AccountTypeSelection() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-50 via-purple-50 to-blue-50 flex items-center justify-center p-4 -mt-14">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Choose Your Role
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
