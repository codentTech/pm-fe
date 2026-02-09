"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ForgotPassword from "@/components/forgot-password/forgot-password.component";

export default function ForgotPasswordPage() {
  return <Auth component={<ForgotPassword />} type={AUTH.PUBLIC} />;
}
