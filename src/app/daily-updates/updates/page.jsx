"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import DailyUpdatesUpdates from "@/components/daily-updates/list/list.component";

export default function DailyUpdatesUpdatesPage() {
  return (
    <Auth
      component={<DailyUpdatesUpdates />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.DAILY_UPDATES}
    />
  );
}
