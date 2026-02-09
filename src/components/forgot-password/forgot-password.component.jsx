"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import useForgotPassword from "./use-forgot-password.hook";

export default function ForgotPassword() {
  const router = useRouter();
  const { form, onSubmit, isLoading, submitted } = useForgotPassword();

  if (submitted) {
    return (
      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-card text-center py-12">
            <h2 className="typography-h3 text-primary-600 mb-4">
              Check your email
            </h2>
            <p className="typography-body text-neutral-600 mb-6">
              If an account exists with that email, you will receive a password
              reset link.
            </p>
            <CustomButton
              text="Back to sign in"
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
        <div className="form-card">
          <Link href="/" className="mb-5 flex justify-center">
            <span className="typography-h3 text-primary-600">
              Forgot password
            </span>
          </Link>
          <div className="form-header">
            <p className="form-header-p">
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="form-body">
            <div className="form-fields">
              <CustomInput
                label="Email"
                name="Email"
                type="email"
                placeholder="you@example.com"
                register={form.register}
                errors={form.formState.errors}
                isRequired
              />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <CustomButton
                type="submit"
                text="Send reset link"
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
