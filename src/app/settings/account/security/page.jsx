"use client";

import Auth from "@/auth/auth.component";
import SecuritySettings from "@/components/user-settings/security-settings.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";

export default function SecuritySettingsPage() {
  return (
    <Auth
      component={<SecuritySettings />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.ACCOUNT}
    />
  );
}
