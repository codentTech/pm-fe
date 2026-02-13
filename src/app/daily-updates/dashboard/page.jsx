"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import DailyUpdatesDashboard from "@/components/daily-updates/daily-updates-dashboard/daily-updates-dashboard.component";

export default function DailyUpdatesDashboardPage() {
  return (
    <Auth
      component={<DailyUpdatesDashboard />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.DAILY_UPDATES}
    />
  );
}
