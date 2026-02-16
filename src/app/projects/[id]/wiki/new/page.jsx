"use client";

import { use } from "react";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import ProjectWikiEditor from "@/components/projects/wiki/project-wiki-editor.component";

export default function ProjectWikiNewPage({ params }) {
  const { id } = use(params);
  return (
    <Auth
      component={<ProjectWikiEditor projectId={id} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.PROJECT_DETAIL}
    />
  );
}
