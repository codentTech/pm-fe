"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { getStoredReturnUrl } from "@/common/utils/auth-return-url.util";
import { verifyEmail } from "@/provider/features/auth/auth.slice";

export default function useVerifyEmail() {
  // stats
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("verifying");
  const [signInHref, setSignInHref] = useState("/login");

  // useEffect
  useEffect(() => {
    const token = searchParams?.get?.("token");
    if (!token) {
      setStatus("error");
      return;
    }
    const returnUrl = getStoredReturnUrl();
    setSignInHref(
      returnUrl
        ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
        : "/login"
    );
    dispatch(
      verifyEmail({
        token,
        successCallBack: () => setStatus("success"),
        errorCallBack: () => setStatus("error"),
      })
    );
  }, [searchParams, dispatch]);

  // functions
  function handleSignIn() {
    router.push(signInHref);
  }

  function handleSignUp() {
    router.push("/sign-up");
  }

  return { status, handleSignIn, handleSignUp };
}
