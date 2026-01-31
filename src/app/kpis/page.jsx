"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import KpiTracker from "@/components/kpis/kpi-tracker/kpi-tracker.component";

export default function KpisPage() {
  return (
    <Auth
      component={<KpiTracker />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.KPIS}
    />
  );
}
