"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import useVerifyEmail from "./use-verify-email.hook";

export default function VerifyEmail() {
  const { status, handleSignIn, handleSignUp } = useVerifyEmail();

  if (status === "verifying") {
    return (
      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-card text-center py-12">
            <p className="typography-body text-neutral-600">
              Verifying your email...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-card text-center py-12">
            <h2 className="typography-h3 text-primary-600 mb-4">
              Email verified!
            </h2>
            <p className="typography-body text-neutral-600 mb-6">
              Your account has been verified. You can now sign in.
            </p>
            <CustomButton
              text="Sign in"
              variant="primary"
              className="w-full rounded-lg py-2.5 sm:w-auto sm:min-w-[140px]"
              onClick={() => router.push("/login")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-card text-center py-12">
          <h2 className="typography-h3 text-red-600 mb-4">
            Verification failed
          </h2>
          <p className="typography-body text-neutral-600 mb-6">
            The verification link is invalid or has expired. Please request a
            new one or sign up again.
          </p>
          <CustomButton
            text="Sign up"
            variant="primary"
            className="w-full rounded-lg py-2.5 sm:w-auto sm:min-w-[140px]"
            onClick={handleSignUp}
          />
        </div>
      </div>
    </div>
  );
}
