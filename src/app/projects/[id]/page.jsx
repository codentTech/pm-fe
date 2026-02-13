"use client";

import { use } from "react";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import BoardDetail from "@/components/boards/board-detail/board-detail.component";

export default function ProjectDetailPage({ params }) {
  const { id } = use(params);

  return (
    <Auth
      component={<BoardDetail projectId={id} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.PROJECT_DETAIL}
    />
  );
}
