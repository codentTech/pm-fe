"use client";

import Auth from "@/auth/auth.component";
import WorkspaceInvitesSection from "@/components/workspace-settings/invites-section/workspace-invites-section.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkspaceInvitesPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params?.id;
  const { organizations } = useSelector((state) => state.organizations || {});

  useEffect(() => {
    if (!orgId) return;
    if (organizations?.length > 0 && !organizations.find((o) => o.Id === orgId)) {
      router.replace("/settings/workspace");
    }
  }, [orgId, organizations, router]);

  if (!orgId) return null;

  return (
    <Auth
      component={<WorkspaceInvitesSection orgId={orgId} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.WORKSPACE_SETTINGS}
    />
  );
}
