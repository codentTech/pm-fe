"use client";

import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";

export default function DeleteBidModal({
  show,
  onClose,
  onConfirm,
  bidToDelete,
  loading,
}) {
  return (
    <ConfirmationModal
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete this bid?"
      description={
        bidToDelete
          ? `"${bidToDelete.BidTitle}" will be permanently removed. This cannot be undone.`
          : "This bid will be permanently removed. This cannot be undone."
      }
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      loading={loading}
    />
  );
}
