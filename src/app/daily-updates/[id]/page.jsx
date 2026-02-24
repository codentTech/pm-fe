"use client";

import { use } from "react";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import DailyUpdateDetail from "@/components/daily-updates/detail/detail.component";

export default function DailyUpdateDetailPage({ params }) {
  const { id } = use(params);
  return (
    <Auth
      component={<DailyUpdateDetail updateId={id} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.DAILY_UPDATES}
    />
  );
}
