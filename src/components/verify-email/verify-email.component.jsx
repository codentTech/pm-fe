"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import useVerifyEmail from "./use-verify-email.hook";

export default function VerifyEmail() {
  const { status, handleSignIn, handleSignUp, handleNext } = useVerifyEmail();
  const router = useRouter();

  /* ---------------- Verifying State ---------------- */
  if (status === "verifying") {
    return (
      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-card flex min-h-[280px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <p className="typography-body text-neutral-600">
                Verifying your email
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Success State ---------------- */
  if (status === "success") {
    return (
      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-card">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
            </div>

            {/* Header */}
            <div className="form-header text-center">
              <p className="bg-primary-600 text-white rounded-lg p-2">
                Email verified successfully
              </p>

              <p className="my-4 typography-body text-neutral-700">
                Your account has been verified successfully.
              </p>

              <p className="typography-caption text-neutral-500">
                You can now sign in and start using your account.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col gap-3">
              <CustomButton
                text="Next"
                variant="primary"
                className="w-full"
                onClick={handleNext}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Error State ---------------- */
  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-card">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600">
              <XCircle className="h-7 w-7 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="form-header text-center">
            <p className="bg-red-600 text-white rounded-lg p-2">
              Verification failed
            </p>

            <p className="my-4 typography-body text-neutral-700">
              The verification link is invalid or has expired.
            </p>

            <p className="typography-caption text-neutral-500">
              Please request a new verification email or create a new account.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-col gap-3">
            <CustomButton
              text="Sign up"
              variant="primary"
              className="w-full"
              onClick={handleSignUp}
            />
            <CustomButton
              text="Go to Sign in"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/login")}
            />

            <p className="text-center typography-caption text-neutral-500">
              Already have an account? Try signing in instead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
