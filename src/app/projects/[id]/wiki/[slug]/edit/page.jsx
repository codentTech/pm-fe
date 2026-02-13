"use client";

import { use } from "react";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import ProjectWikiForm from "@/components/projects/wiki/project-wiki-form.component";

export default function ProjectWikiEditPage({ params }) {
  const { id, slug } = use(params);

  return (
    <Auth
      component={<ProjectWikiForm projectId={id} slug={slug} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.PROJECT_DETAIL}
    />
  );
}
