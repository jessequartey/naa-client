import SignInForm from "@/components/auth/SignInForm";
import React from "react";

export default function SignInPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
      <div className="px-10">
        <div className="w-full ">
          <div className="-mb-8 flex flex-col items-center space-y-2 text-center">
            <h1 className="text-2xl font-semibold ">Sign in your account</h1>
            <p className="text-sm text-muted-foreground">
              Enter account details below to sign in to your account
            </p>
          </div>
          <div className="pt-12">
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}
