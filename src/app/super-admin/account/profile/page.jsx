"use client";

import Auth from "@/auth/auth.component";
import ProfileSettings from "@/components/user-settings/profile-settings.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";

export default function SuperAdminProfilePage() {
  return (
    <Auth
      component={<ProfileSettings />}
      type={AUTH.SUPER_ADMIN}
      title={NAVBAR_TITLE.PROFILE}
    />
  );
}
