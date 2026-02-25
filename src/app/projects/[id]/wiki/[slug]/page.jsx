"use client";

import { use } from "react";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import ProjectWikiDetail from "@/components/projects/wiki/components/details/project-wiki-detail.component";

export default function ProjectWikiDetailPage({ params }) {
  const { id, slug } = use(params);
  return (
    <Auth
      component={<ProjectWikiDetail projectId={id} slug={slug} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.PROJECT_DETAIL}
    />
  );
}
