"use client";

import { use } from "react";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import BidDetail from "@/components/bids/bid-detail/bid-detail.component";

export default function BidDetailPage({ params }) {
  const { id } = use(params);

  return (
    <Auth
      component={<BidDetail bidId={id} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.BIDS}
    />
  );
}
