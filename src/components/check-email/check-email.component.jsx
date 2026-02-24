"use client";

import { Mail } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useCheckEmail from "./use-check-email.hook";

export default function CheckEmail() {
  const { email, handleSignIn } = useCheckEmail();

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-card">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600">
              <Mail className="h-7 w-7 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="form-header text-center">
            <p className="bg-primary-600 text-white rounded-lg p-2">
              Verify your email address
            </p>

            <p className="my-4 typography-body text-neutral-700">
              We&apos;ve sent a verification link to{` `}
              {email ? (
                <span className="font-semibold text-primary-600">{email}</span>
              ) : (
                <span className="font-semibold text-primary-600">
                  your email
                </span>
              )}
            </p>

            <p className="typography-caption text-neutral-500 bg-gray-100 p-2 rounded-lg">
              Please check your inbox and click the link to verify your account
              before signing in.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-col gap-3">
            {/* <CustomButton
              text="Resend email"
              variant="outline"
              className="w-full"
            /> */}

            <p className="text-center typography-caption text-neutral-500">
              Didn&apos;t receive the email? Check spam or try again later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
