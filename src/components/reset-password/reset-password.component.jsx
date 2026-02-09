"use client";

import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import useResetPassword from "./use-reset-password.hook";

export default function ResetPassword() {
  const { form, onSubmit, isLoading, token, error } = useResetPassword();

  if (!token) {
    return (
      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-card text-center py-12">
            <h2 className="typography-h3 text-red-600 mb-4">Invalid link</h2>
            <p className="typography-body text-neutral-600 mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Link
              href="/auth/forgot-password"
              className="inline-block rounded-lg bg-primary-600 px-6 py-2.5 font-medium text-white hover:bg-primary-700"
            >
              Request new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-card">
          <Link href="/" className="mb-5 flex justify-center">
            <span className="typography-h3 text-primary-600">
              Reset password
            </span>
          </Link>
          <div className="form-header">
            <p className="form-header-p">Enter your new password below.</p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="form-body">
            {error && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="form-fields">
              <CustomInput
                label="New password"
                name="NewPassword"
                type="password"
                placeholder="••••••••"
                register={form.register}
                errors={form.formState.errors}
                isRequired
              />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <CustomButton
                type="submit"
                text="Reset password"
                variant="primary"
                className="w-full rounded-lg py-2.5"
                loading={isLoading}
                disabled={isLoading}
              />
              <Link
                href="/login"
                className="text-center typography-caption text-neutral-500 hover:text-primary-600"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
