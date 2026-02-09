"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getEmailForURL, isProfileCreated } from "@/common/utils/users.util";
import { isLoginVerified } from "@/common/utils/access-token.util";

export default function useVerify() {
  // stats
  const dispatch = useDispatch();
  const router = useRouter(null);
  const apiResponseRef = useRef({ res: null });

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const email = params.get("email");
    const type = params.get("type");
    const token = params.get("token");
    if (!(email && type && token)) {
      router.push("/");
      return;
    }
    if (!apiResponseRef.current.res) {
      apiResponseRef.current.res = true;
      verify(email, type, token);
    }
  }, []);

  // functions
  function moveRouterEmail(data) {
    if (isProfileCreated(data)) {
      if (isLoginVerified(data)) {
        router.push("/dashboard");
      } else {
        router.push(`/two-factor-auth?userId=${data.id}&phone=${data.phone}`);
      }
    } else {
      router.push(`/profile?email=${getEmailForURL(data.email)}&userId=${data.id}`);
    }
  }

  function moveRouterPassword(data) {
    router.push(`/create-new-password?email=${getEmailForURL(data.email)}&token=${data.token}`);
  }

  function moveRouterError(email, type) {
    const _email = getEmailForURL(email);
    const _type = type;
    return () => router.push(`/auth/verification-expire?email=${_email}&type=${_type}`);
  }

  function verify(email, type, token) {
    const body = { accessToken: token, email };
    // if (type === 'email-verification') {
    //   dispatch(verifyEmail({ payload: body, successCallBack: moveRouterEmail, errorCallBack: moveRouterError(email, type) }));
    // } else {
    //   moveRouterPassword({ email, token });
    // }
  }
}
