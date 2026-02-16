import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useLogin from "./use-login.hook";
import CustomInput from "@/common/components/custom-input/custom-input.component";

export default function Login() {
  // hooks
  const {
    onSubmit,
    loginError,
    isChecked,
    setIsChecked,
    router,
    loading,
    register,
    handleSubmit,
    errors,
    email,
    password,
  } = useLogin();

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-card">
          <Link href="/" className="mb-5 flex justify-center">
            <span className="typography-h3 text-primary-600">Sign in</span>
          </Link>
          <div className="form-header">
            <p className="form-header-p">
              Welcome back. <span className="text-primary">Sign in</span> to
              your account
            </p>
          </div>
          <div className="form-body">
            <form
              className="w-full"
              onSubmit={handleSubmit(onSubmit)}
              method="post"
            >
              <div className="form-fields">
                <CustomInput
                  label="Email/Username"
                  name="email"
                  register={register}
                  errors={errors}
                  placeholder="Enter Email or Username"
                  isRequired={true}
                />

                <CustomInput
                  label="Password"
                  name="password"
                  type="password"
                  register={register}
                  errors={errors}
                  placeholder="*******"
                  isRequired={true}
                />
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div
                  className="flex cursor-pointer gap-[6.5px]"
                  onClick={() => setIsChecked(!isChecked)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setIsChecked(!isChecked)
                  }
                  role="button"
                  tabIndex={0}
                  aria-label="Remember me"
                >
                  {isChecked ? (
                    <img src="/assets/icons/check.svg" alt="" />
                  ) : (
                    <img src="/assets/icons/uncheck.svg" alt="" />
                  )}

                  <label
                    htmlFor="terms"
                    id="terms"
                    className="cursor-pointer typography-label font-normal"
                  >
                    Remember Me
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="rounded-xl typography-caption font-semibold"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="mt-6">
                <CustomButton
                  type="submit"
                  className="w-full rounded-lg py-2.5"
                  text="Sign in"
                  loading={loading}
                  disabled={!email || !password || loading}
                />
              </div>

              {/* <p className="mt-4 text-center typography-caption text-neutral-500">
                Create an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Sign up
                </Link>
              </p> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
