"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import DailyUpdatesAnalytics from "@/components/daily-updates/analytics/analytics.component";

export default function DailyUpdatesAnalyticsPage() {
  return (
    <Auth
      component={<DailyUpdatesAnalytics />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.DAILY_UPDATES}
    />
  );
}
