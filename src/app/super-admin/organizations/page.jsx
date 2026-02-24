"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import SuperAdminOrganizationsList from "@/components/super-admin/organization-list/organizations-list.component";

export default function SuperAdminOrganizationsPage() {
  return (
    <Auth
      component={<SuperAdminOrganizationsList />}
      type={AUTH.SUPER_ADMIN}
      title={NAVBAR_TITLE.ORGANIZATIONS}
    />
  );
}
