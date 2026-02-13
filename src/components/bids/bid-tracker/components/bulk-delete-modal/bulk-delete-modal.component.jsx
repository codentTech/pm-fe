"use client";

import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";

export default function BulkDeleteModal({
  show,
  onClose,
  onConfirm,
  selectedCount,
  loading,
}) {
  return (
    <ConfirmationModal
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${selectedCount} bid${selectedCount > 1 ? "s" : ""}?`}
      description={`${selectedCount} bid${selectedCount > 1 ? "s" : ""} will be permanently removed. This cannot be undone.`}
      confirmText="Delete Selected"
      cancelText="Cancel"
      variant="danger"
      loading={loading}
    />
  );
}
