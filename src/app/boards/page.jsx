"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import BoardsList from "@/components/boards/boards-list.component";

export default function BoardsPage() {
  return (
    <Auth
      component={<BoardsList />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.PROJECTS}
    />
  );
}
