"use client";

import { use } from "react";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import DailyUpdateForm from "@/components/daily-updates/daily-update-form/daily-update-form.component";

export default function DailyUpdateEditPage({ params }) {
  const { id } = use(params);
  return (
    <Auth
      component={<DailyUpdateForm updateId={id} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.DAILY_UPDATES}
    />
  );
}
