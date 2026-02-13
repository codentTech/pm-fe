"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import BidDashboard from "@/components/bids/bid-dashboard/bid-dashboard.component";

export default function BidsPage() {
  return (
    <Auth
      component={<BidDashboard />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.BIDS}
    />
  );
}
