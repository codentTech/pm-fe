"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import CheckEmail from "@/components/check-email/check-email.component";

export default function CheckEmailPage() {
  return <Auth component={<CheckEmail />} type={AUTH.PUBLIC} />;
}
