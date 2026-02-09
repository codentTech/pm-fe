"use client";

import { Mail } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useCheckEmail from "./use-check-email.hook";

export default function CheckEmail() {
  const { email, handleSignIn } = useCheckEmail();

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-card text-center py-12">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
              <Mail className="h-7 w-7 text-primary-600" />
            </div>
          </div>
          <h2 className="typography-h3 text-primary-600 mb-4">
            Check your email
          </h2>
          <p className="typography-body text-neutral-600 mb-6">
            We&apos;ve sent a verification link to{" "}
            {email ? (
              <span className="font-medium text-neutral-800">{email}</span>
            ) : (
              "your email"
            )}
            . Please check your inbox and click the link to verify your account
            before signing in.
          </p>
          <CustomButton
            text="Sign in"
            variant="primary"
            className="w-full rounded-lg py-2.5 sm:w-auto sm:min-w-[140px]"
            onClick={handleSignIn}
          />
        </div>
      </div>
    </div>
  );
}
