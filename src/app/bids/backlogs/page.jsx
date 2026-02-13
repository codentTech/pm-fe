"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import BidBacklogs from "@/components/bids/bid-backlogs/bid-backlogs.component";

export default function BidsBacklogsPage() {
  return (
    <Auth
      component={<BidBacklogs />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.BIDS}
    />
  );
}
