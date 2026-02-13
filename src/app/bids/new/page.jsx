"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import BidNew from "@/components/bids/bid-new/bid-new.component";

export default function BidsNewPage() {
  return (
    <Auth
      component={<BidNew />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.BIDS}
    />
  );
}
