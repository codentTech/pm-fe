"use client";

import Auth from "@/auth/auth.component";
import SecuritySettings from "@/components/user-settings/security-settings.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";

export default function SuperAdminSecurityPage() {
  return (
    <Auth
      component={<SecuritySettings />}
      type={AUTH.SUPER_ADMIN}
      title={NAVBAR_TITLE.SECURITY}
    />
  );
}
