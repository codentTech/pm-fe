"use client";

import { use } from "react";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import CardDetail from "@/components/cards/card-detail/card-detail.component";

export default function CardDetailPage({ params }) {
  const resolved = use(params);
  const projectId = resolved.id;
  const cardId = resolved.cardId;

  return (
    <Auth
      component={<CardDetail projectId={projectId} cardId={cardId} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.PROJECT_DETAIL}
    />
  );
}
