"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setStoredReturnUrl } from "@/common/utils/auth-return-url.util";

export default function useCheckEmail() {
  // stats
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const returnUrl = searchParams?.get("returnUrl");
  const signInUrl =
    returnUrl && typeof returnUrl === "string"
      ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
      : "/login";

  // useEffect
  useEffect(() => {
    if (returnUrl && typeof returnUrl === "string") {
      setStoredReturnUrl(returnUrl);
    }
  }, [returnUrl]);

  // functions
  function handleSignIn() {
    router.push(signInUrl);
  }

  return { email, signInUrl, handleSignIn };
}
