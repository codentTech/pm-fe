"use client";

import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import useSignUp from "./use-sign-up.hook";

export default function SignUp() {
  const { register, handleSubmit, errors, onSubmit } = useSignUp();

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-card">
          <Link href="/" className="mb-5 flex justify-center">
            <span className="typography-h3 text-primary-600">Create account</span>
          </Link>
          <div className="form-header">
            <p className="form-header-p">
              Create your <span className="text-primary">account</span>
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="form-body">
            <div className="form-fields">
              <CustomInput
                label="Full name"
                name="FullName"
                placeholder="John Doe"
                register={register}
                errors={errors}
                isRequired
              />
              <CustomInput
                label="Email"
                name="Email"
                type="email"
                placeholder="you@example.com"
                register={register}
                errors={errors}
                isRequired
              />
              <CustomInput
                label="Password"
                name="Password"
                type="password"
                placeholder="••••••••"
                register={register}
                errors={errors}
                isRequired
              />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <CustomButton
                type="submit"
                text="Create account"
                variant="primary"
                className="w-full rounded-lg py-2.5"
              />
              <p className="text-center typography-caption text-neutral-500">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
