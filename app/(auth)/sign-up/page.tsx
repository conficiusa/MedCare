import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/ui/googleIcon";
import Link from "next/link";

const SignUp = ({ searchParams }: { searchParams: { role?: string } }) => {
  const role = searchParams.role;
  return (
    <div className="flex lg:pt-36 items-center flex-col lg:px-20 max-lg:h-[85dvh] justify-center max-lg:gap-10">
      <div className="flex flex-col gap-10 lg:flex-1 max-lg:text-center">
        <div>
          <h3 className="text-2xl font-semibold"> Welcome to MedCare Hub</h3>
          <p className="text-muted-foreground text-sm">
            You are just a few steps away from getting the best health care from
            the comfort of your home
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <form
            action={async () => {
              "use server";
              await signIn("google", {
                callbackUrl: "/",
                role: role,
              });
            }}
          >
            <Button className="w-full" variant={"outline"}>
              <GoogleIcon /> Continue with Google
            </Button>
          </form>

          <Link href={"/sign-up/form"} className="w-full">
            <Button className="w-full">Continue with Email</Button>
          </Link>
        </div>
      </div>
      <div className="w-full max-lg:text-center">
        <p className="text-sm text-muted-foreground">
          By Signing up you agree to our <br />{" "}
          <Link href={"#"} className="text-black font-medium underline">
            Terms of Service
          </Link>{" "}
          &{" "}
          <Link href={""} className="text-black font-medium underline">
            Privacy Policy
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default SignUp;
