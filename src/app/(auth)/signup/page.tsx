import SignUpForm from "@/components/auth/SignUpForm";
import React from "react";

export default function SignUpPage() {
  return (
    <div className="relative  flex flex-col items-center justify-center">
      <div className="p-10">
        <div className="w-full ">
          <div className="-mb-8 flex flex-col items-center space-y-2 text-center">
            <h1 className="text-2xl font-semibold ">Create an account</h1>
          </div>
          <div className="pt-12">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
