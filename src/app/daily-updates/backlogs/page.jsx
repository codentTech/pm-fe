"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import DailyUpdatesBacklogs from "@/components/daily-updates/daily-updates-backlogs/daily-updates-backlogs.component";

export default function DailyUpdatesBacklogsPage() {
  return (
    <Auth
      component={<DailyUpdatesBacklogs />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.DAILY_UPDATES}
    />
  );
}
