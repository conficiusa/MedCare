"use client";

import { useEffect, useState } from "react";
import { Shield, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useActorRef, useSelector } from "@xstate/react";
import { verificationMachine } from "@/state_machines/bankverification";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function VerificationCard() {
  const [code, setCode] = useState("");
  const consultRef = useActorRef(verificationMachine, { input: { code } });
  const [value, context] = useSelector(consultRef, (state) => {
    return [state.value, state.context];
  });
  const router = useRouter();
  useEffect(() => {
    if (code.length === 6) {
      consultRef.send({ type: "VERIFY_CODE", code });
    }
  }, [code]);
  
  useEffect(() => {
    if (value === "verified_successfully") {
      router.refresh();
    }
  }, [value]);

  if (
    ![
      "code_sent",
      "verification_failed",
      "verifying_code",
      "verified_successfully",
    ].includes(value)
  ) {
    return (
      <Card className="w-full max-w-md mx-auto dark:bg-muted/40 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Verification Required
          </CardTitle>
          <CardDescription>
            To update your bank details, we need to verify your identity.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            We'll send a verification code to your registered email address.
            Please enter this code on the next screen to proceed.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="w-full max-w-xs"
            onClick={() => consultRef.send({ type: "REQUEST_CODE" })}
            disabled={value !== "initial"}
          >
            {value === "sending_code" ? (
              <>
                <Send className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Code
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    <Card className="w-full max-w-md mx-auto dark:bg-muted/40 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Verification Required
        </CardTitle>
        <CardDescription>
          To update your bank details, we need to verify your identity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Please enter the 6-digit code sent to your email.
          </p>
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6));
            }}
            className="text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>
        {context.error && (
          <Alert variant="destructive" className="mt-3 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{context.message} </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="flex flex-col gap-2 w-full items-center justify-center">
          <Button
            onClick={() => consultRef.send({ type: "VERIFY_CODE", code })}
            disabled={code.length !== 6 || value === "verifying_code"}
            className="w-full max-w-xs"
          >
            {value === "verifying_code" ? "Verifying..." : "Verify"}
          </Button>
          {context.allowResend && (
            <Button
              onClick={() => consultRef.send({ type: "RESEND_CODE" })}
              variant={"ghost"}
              className="text-xs"
            >
              Resend Code
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
