"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ResetPassword from "@/components/reset-password/reset-password.component";

export default function ResetPasswordPage() {
  return <Auth component={<ResetPassword />} type={AUTH.PUBLIC} />;
}
