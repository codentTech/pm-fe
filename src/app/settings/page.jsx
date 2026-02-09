"use client";

import Auth from "@/auth/auth.component";
import SettingsHub from "@/components/settings-hub/settings-hub.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";

export default function SettingsHubPage() {
  return (
    <Auth
      component={<SettingsHub />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.SETTINGS}
    />
  );
}
