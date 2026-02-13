"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import BidAll from "@/components/bids/bid-all/bid-all.component";

export default function BidAllPage() {
  return (
    <Auth component={<BidAll />} type={AUTH.PRIVATE} title={NAVBAR_TITLE.BIDS} />
  );
}
