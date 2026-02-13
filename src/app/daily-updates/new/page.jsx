"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import DailyUpdateForm from "@/components/daily-updates/daily-update-form/daily-update-form.component";

export default function DailyUpdateNewPage() {
  return (
    <Auth
      component={<DailyUpdateForm />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.DAILY_UPDATES}
    />
  );
}
