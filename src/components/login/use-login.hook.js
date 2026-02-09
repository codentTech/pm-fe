"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AES, enc } from "crypto-js";
import {
  login,
  loginAndSignUpWithOAuth,
} from "@/provider/features/auth/auth.slice";
import { isLoginVerified } from "@/common/utils/access-token.util";
import { isSafeReturnUrl } from "@/common/utils/is-safe-return-url.util";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function useLogin() {
  // stats
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.auth?.login?.message) || "";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { email, password } = watch();

  // useEffect
  useEffect(() => {
    if (isLoginVerified()) {
    }
  }, [router]);

  useEffect(() => {
    loadRememberedCredentials();
  }, []);

  // functions
  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  function moveRouter() {
    const returnUrl = searchParams?.get("returnUrl");
    if (returnUrl && typeof window !== "undefined" && isSafeReturnUrl(returnUrl)) {
      router.push(returnUrl);
    } else {
      router.push("/projects");
    }
  }

  function loadRememberedCredentials() {
    if (typeof window !== "object") return;
    if (
      localStorage?.getItem("rememberedUsername") &&
      localStorage?.getItem("rememberedPassword")
    ) {
      const storedUsername = localStorage.getItem("rememberedUsername");
      const storedEncryptedPassword = localStorage.getItem("rememberedPassword");
      const bytes = AES.decrypt(
        storedEncryptedPassword,
        process.env.NEXT_PUBLIC_MAIN_URL_SECRET_KEY
      );
      const decryptedPassword = bytes.toString(enc.Utf8);
      setValue("email", storedUsername);
      setValue("password", decryptedPassword);
    }
  }

  async function onSubmit(values) {
    setLoading(true);
    const response = await dispatch(
      login({
        payload: { Email: values.email, Password: values.password },
        successCallBack: moveRouter,
        setLoading,
      })
    );
    response && setLoading(false);
    if (typeof window === "object" && localStorage) {
      if (isChecked) {
        const encryptedPassword = AES.encrypt(
          values.password,
          process.env.NEXT_PUBLIC_MAIN_URL_SECRET_KEY
        ).toString();
        localStorage.setItem("rememberedUsername", values.email);
        localStorage.setItem("rememberedPassword", encryptedPassword);
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }
    }
  }

  function loginWithOAuth(loginType, email, accessToken) {
    dispatch(
      loginAndSignUpWithOAuth({
        loginType,
        email,
        accessToken,
        successCallBack: moveRouter,
      })
    );
  }

  return {
    onSubmit,
    loginError,
    showPassword,
    isChecked,
    setIsChecked,
    toggleShowPassword,
    router,
    loading,
    loginWithOAuth,
    register,
    handleSubmit,
    errors,
    password,
    email,
  };
}
