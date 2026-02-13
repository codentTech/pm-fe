"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CreateBidModal from "../bid-tracker/components/create-bid-modal/create-bid-modal.component";
import useBidTracker from "../bid-tracker/use-bid-tracker.hook";
import { currencyOptions } from "@/common/constants/options.constant";

export default function BidNew() {
  const router = useRouter();
  const submitRef = useRef(false);
  const {
    showCreateModal,
    setShowCreateModal,
    createForm,
    handleCreate,
    createBidState,
    BID_PLATFORM_OPTIONS,
  } = useBidTracker();

  useEffect(() => {
    setShowCreateModal(true);
  }, [setShowCreateModal]);

  useEffect(() => {
    if (submitRef.current && createBidState?.isSuccess) {
      submitRef.current = false;
      router.push("/bids/all");
    }
  }, [createBidState?.isSuccess, router]);

  const handleSubmit = (values) => {
    submitRef.current = true;
    handleCreate(values);
  };

  const handleClose = () => {
    setShowCreateModal(false);
    router.push("/bids/all");
  };

  return (
    <CreateBidModal
      show={showCreateModal}
      onClose={handleClose}
      createForm={createForm}
      onSubmit={handleSubmit}
      createBidState={createBidState}
      BID_PLATFORM_OPTIONS={BID_PLATFORM_OPTIONS}
      currencyOptions={currencyOptions}
    />
  );
}
