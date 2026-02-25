"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import WorkspaceSettings from "@/components/workspace-settings/workspace-settings.component";

export default function WorkspaceSettingsPage() {
  return (
    <Auth
      component={<WorkspaceSettings />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.WORKSPACE_SETTINGS}
    />
  );
}
