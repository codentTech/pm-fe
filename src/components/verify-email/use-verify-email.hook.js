"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  getStoredReturnUrl,
  peekStoredReturnUrl,
} from "@/common/utils/auth-return-url.util";
import { isSafeReturnUrl } from "@/common/utils/is-safe-return-url.util";
import { verifyEmail } from "@/provider/features/auth/auth.slice";

export default function useVerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState("verifying");
  const [signInHref, setSignInHref] = useState("/login");
  const [nextReturnUrl, setNextReturnUrl] = useState("/dashboard");

  const LOCK_KEY = "verify_email_called";

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    if (!searchParams) return;

    const prevToken = sessionStorage.getItem(LOCK_KEY);
    if (prevToken === token) {
      setStatus("success");
      return;
    }

    sessionStorage.setItem(LOCK_KEY, token);

    // Peek (don't remove) so "Next" can read it at click time (other tab may set it later)
    const returnUrl = peekStoredReturnUrl();
    const safeReturnUrl =
      returnUrl && isSafeReturnUrl(returnUrl) ? returnUrl : null;
    setSignInHref(
      safeReturnUrl
        ? `/login?returnUrl=${encodeURIComponent(safeReturnUrl)}`
        : "/login",
    );
    setNextReturnUrl(safeReturnUrl || "/dashboard");

    dispatch(
      verifyEmail({
        token,
        successCallBack: () => {
          setStatus("success");
          sessionStorage.removeItem(LOCK_KEY);
        },
        errorCallBack: () => {
          setStatus("error");
          sessionStorage.removeItem(LOCK_KEY);
        },
      }),
    );

    const timeout = setTimeout(() => {
      setStatus((s) => (s === "verifying" ? "error" : s));
      sessionStorage.removeItem(LOCK_KEY);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [searchParams, dispatch, token]);

  const handleSignIn = () => router.push(signInHref);
  const handleSignUp = () => router.push("/sign-up");

  const handleNext = () => {
    // Read at click time so we get the URL set by check-email (e.g. in other tab)
    const url = getStoredReturnUrl();
    const safe =
      url && isSafeReturnUrl(url) ? url : isSafeReturnUrl(nextReturnUrl) ? nextReturnUrl : "/dashboard";
    router.push(safe);
  };

  return { status, handleSignIn, handleSignUp, handleNext };
}
