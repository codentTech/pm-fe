"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import VerifyEmail from "@/components/verify-email/verify-email.component";

export default function VerifyEmailPage() {
  return <Auth component={<VerifyEmail />} type={AUTH.PUBLIC} />;
}
