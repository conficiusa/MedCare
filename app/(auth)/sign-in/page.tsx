import { signIn } from "@/auth";
import SignInform from "@/components/blocks/signInform";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/ui/googleIcon";
import React from "react";

const SignIn = () => {
  return (
    <div className="flex justify-center rounded-r-md py-10">
      <div className="flex flex-col gap-4 max-w-md w-full">
        <div className="grid">
          <h2 className="text-3xl font-semibold">Login</h2>
          <p>Fill the form below to log in</p>
        </div>
        <div>
          <SignInform />
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-muted"></div>
            <span className="mx-2 text-muted-foreground text-sm">or</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>
          <form
            action={async () => {
              "use server";
              await signIn("google", { callbackUrl: "/" });
            }}
          >
            <Button variant="outline" className="w-full">
              <GoogleIcon /> Continue with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
