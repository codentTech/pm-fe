"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import ProjectsDashboard from "@/components/projects/dashboard/projects-dashboard.component";

export default function ProjectsDashboardPage() {
  return (
    <Auth
      component={<ProjectsDashboard />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.PROJECTS}
    />
  );
}
