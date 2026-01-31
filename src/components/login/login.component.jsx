import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import useLogin from "./use-login.hook";
import CustomInput from "@/common/components/custom-input/custom-input.component";

export default function Login() {
  // hooks
  const {
    onSubmit,
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
          <Link href="/" className="mb-6 flex justify-center">
            <span className="text-2xl font-bold text-primary-600">
              Trello Clone
            </span>
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

              <div className="mt-4 flex items-center justify-between">
                <div
                  className="flex gap-[6.5px]"
                  onClick={() => setIsChecked(!isChecked)}
                >
                  {isChecked ? (
                    <img src="/assets/icons/check.svg" alt="" />
                  ) : (
                    <img src="/assets/icons/uncheck.svg" alt="" />
                  )}

                  <label
                    htmlFor="terms"
                    id="terms"
                    className="fon cursor-pointer text-[12px]
                 font-normal not-italic leading-[18px]"
                  >
                    Remember Me
                  </label>
                </div>
                <Link
                  href="/forget-password"
                  onClick={() =>
                    router.push(
                      "/forget-password?btnText=Password%20Recovery%20Link",
                    )
                  }
                  className="forgotText rounded-xl text-xs font-bold leading-[18px] "
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="form-btn-c mt-[32px]">
                <CustomButton
                  type="submit"
                  className="btn-primary h-[50px] w-full rounded-xl px-[30px] py-3 text-base leading-6"
                  text={!loading && "Login"}
                  startIcon={<Loader loading={loading} />}
                  disabled={!email || !password || loading}
                />
              </div>

              <div className="text-xs font-normal leading-[18px] text-text-dark-gray">
                <p className="login mt-5 text-center">
                  Create an account?
                  <Link href="/" className="span-link">
                    Signup
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
