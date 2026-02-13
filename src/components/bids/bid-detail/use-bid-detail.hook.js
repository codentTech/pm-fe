"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBidById } from "@/provider/features/bids/bids.slice";

export default function useBidDetail(bidId) {
  const dispatch = useDispatch();
  const { bids, fetchBidById: fetchState } = useSelector((state) => state?.bids ?? {});

  useEffect(() => {
    if (bidId) {
      dispatch(fetchBidById({ id: bidId }));
    }
  }, [dispatch, bidId]);

  const bid = (bids || []).find((b) => b.Id === bidId) || null;

  return {
    bid,
    fetchState,
  };
}
