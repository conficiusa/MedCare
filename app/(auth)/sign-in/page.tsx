"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import SignInform from "@/components/blocks/signInform";
import { googleSignIn } from "@/lib/actions";

export default function SignInPage() {
  return (
    <div className="w-full md:w-1/2 p-8 md:p-12">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="#"
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to home
        </Link>
        <div className="sm:flex  hidden items-center" >
          <svg
            className="w-8 h-8 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4h16v16H4V4z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 9h6v6H9V9z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-xl font-semibold">MedCare Hub</h1>
        </div>
      </div>
      <h2 className="sm:text-3xl text-2xl font-bold mb-2">Welcome back</h2>
      <p className="text-gray-600 mb-8">Sign in to your account to continue</p>
      <form action={googleSignIn}>
        <Button
          variant="outline"
          className="w-full mb-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>
      </form>
      <div className="relative my-3">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
          Or continue with
        </span>
      </div>
      <SignInform />
      <p className="mt-6 text-sm text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
