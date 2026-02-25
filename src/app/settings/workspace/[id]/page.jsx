"use client";

import Auth from "@/auth/auth.component";
import WorkspaceDetail from "@/components/workspace-settings/detail/workspace-detail.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";

export default function WorkspaceDetailPage() {
  return (
    <Auth
      component={<WorkspaceDetail />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.WORKSPACE_SETTINGS}
    />
  );
}
