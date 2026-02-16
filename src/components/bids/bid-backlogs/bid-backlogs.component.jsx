"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import KpiTableSkeleton from "@/common/components/skeleton/kpi-table-skeleton.component";
import {
  BID_ACTIONS,
  BID_COLUMNS,
  BID_LOSS_REASON_OPTIONS,
  BID_STATUS_LABELS,
  BID_WITHDRAWAL_REASON_OPTIONS,
} from "@/common/constants/bid.constant";
import { KPI_SEPARATOR_COLORS } from "@/common/constants/colors.constant";
import { Briefcase, Trash2 } from "lucide-react";
import Link from "next/link";
import BulkDeleteModal from "../bid-tracker/components/bulk-delete-modal/bulk-delete-modal.component";
import DeleteBidModal from "../bid-tracker/components/delete-bid-modal/delete-bid-modal.component";
import EditBidModal from "../bid-tracker/components/edit-bid-modal/edit-bid-modal.component";
import StatusTransitionModal from "../bid-tracker/components/status-transition-modal/status-transition-modal.component";
import useBidTracker from "../bid-tracker/use-bid-tracker.hook";
import { currencyOptions } from "@/common/constants/options.constant";

export default function BidBacklogs() {
  const router = useRouter();
  const {
    bids,
    loading,
    activeView,
    setActiveView,
    editingBid,
    setEditingBid,
    editForm,
    handleUpdate,
    requestDeleteBid,
    confirmDeleteBid,
    bidToDeleteId,
    setBidToDeleteId,
    deleteBidState,
    updateBidState,
    BID_PLATFORM_OPTIONS,
    selectedIds,
    handleSelectionChange,
    requestBulkDelete,
    confirmBulkDelete,
    showBulkDeleteModal,
    setShowBulkDeleteModal,
    bulkDeleteBidsState,
    transitionBidStatusState,
    tableData,
    bidToDelete,
    statusModalBid,
    setStatusModalBid,
    statusForm,
    statusError,
    views,
    handleActionClick,
    handleStatusChange,
    submitStatusTransition,
    getStatusOptions,
    handleStatusSelect,
  } = useBidTracker();

  useEffect(() => {
    if (activeView === "all") setActiveView("draft");
  }, [activeView, setActiveView]);

  const backlogViews = views.filter((view) => view.key !== "all");

  return (
    <div className="min-h-full">
      <div className="page-header-bar px-4 sm:px-5">
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">Bid backlogs</h1>
          <p className="page-header-subtitle">
            Focus on pipeline gaps and stalled opportunities.
          </p>
        </div>
        <CustomButton
          text="Log bid"
          onClick={() => router.push("/bids/new")}
          variant="primary"
          size="sm"
          className="shrink-0 rounded-lg px-3 py-1.5 typography-caption font-medium sm:px-4 sm:py-2 sm:typography-button"
        />
      </div>

      <div
        className="mb-4 flex items-center gap-1 px-4 sm:mb-6 sm:px-5"
        aria-hidden
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
        <span className="flex gap-1">
          {KPI_SEPARATOR_COLORS.map((color, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${color}`}
            />
          ))}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
      </div>

      <div className="px-4 sm:px-5">
        <div className="flex flex-wrap gap-2 rounded-lg border border-neutral-200 bg-white/70 p-2 shadow-sm">
          {backlogViews.map((view) => (
            <button
              key={view.key}
              type="button"
              onClick={() => setActiveView(view.key)}
              className={`rounded-lg px-3.5 py-1 text-xs font-semibold transition-all ${
                activeView === view.key
                  ? "bg-indigo-600 text-white shadow-md ring-1 ring-indigo-500/40"
                  : "bg-neutral-200 text-neutral-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <KpiTableSkeleton />
      ) : (
        <div className="mt-6 w-full overflow-x-auto px-4 sm:px-5">
          {selectedIds.length > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2">
              <span className="text-sm font-medium text-indigo-900">
                {selectedIds.length} bid{selectedIds.length > 1 ? "s" : ""}{" "}
                selected
              </span>
              <CustomButton
                text="Delete Selected"
                onClick={requestBulkDelete}
                variant="danger"
                startIcon={<Trash2 className="h-4 w-4" />}
                size="sm"
                loading={bulkDeleteBidsState?.isLoading}
              />
            </div>
          )}

          <CustomDataTable
            columns={BID_COLUMNS.map((col) =>
              col.key === "BidTitle"
                ? {
                    ...col,
                    customRender: (row) => (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50">
                          <Briefcase className="h-4 w-4 text-indigo-600" />
                        </span>
                        <Link
                          href={`/bids/${row.Id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {row.BidTitle || "—"}
                        </Link>
                      </div>
                    ),
                  }
                : col.key === "CurrentStatus"
                  ? {
                      ...col,
                      customRender: (row) => (
                        <div className="relative z-30">
                          <SimpleSelect
                            options={getStatusOptions(row)}
                            value={row.CurrentStatus}
                            onChange={(value) => handleStatusSelect(row, value)}
                            size="sm"
                            variant="minimal"
                            menuPosition="bottom"
                            className="min-w-[140px]"
                          />
                        </div>
                      ),
                    }
                  : col,
            )}
            data={tableData}
            loading={false}
            selectable={true}
            selectedIds={selectedIds}
            onSelectionChange={handleSelectionChange}
            searchable={false}
            paginated={true}
            pageSize={10}
            actions={BID_ACTIONS}
            onActionClick={handleActionClick}
            emptyMessage="No bids found"
            tableClassName="min-w-full divide-y divide-neutral-200"
            headerClassName="border-neutral-200"
            rowClassName="transition-colors"
          />
        </div>
      )}

      <EditBidModal
        show={!!editingBid}
        onClose={() => setEditingBid(null)}
        editForm={editForm}
        onSubmit={handleUpdate}
        updateBidState={updateBidState}
        BID_PLATFORM_OPTIONS={BID_PLATFORM_OPTIONS}
        currencyOptions={currencyOptions}
      />

      <DeleteBidModal
        show={!!bidToDeleteId}
        onClose={() => setBidToDeleteId(null)}
        onConfirm={confirmDeleteBid}
        bidToDelete={bidToDelete}
        loading={deleteBidState?.isLoading}
      />

      <BulkDeleteModal
        show={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={confirmBulkDelete}
        selectedCount={selectedIds.length}
        loading={bulkDeleteBidsState?.isLoading}
      />

      <StatusTransitionModal
        show={!!statusModalBid}
        onClose={() => setStatusModalBid(null)}
        statusModalBid={statusModalBid}
        statusForm={statusForm}
        statusError={statusError}
        handleStatusChange={handleStatusChange}
        submitStatusTransition={submitStatusTransition}
        transitionBidStatusState={transitionBidStatusState}
        BID_STATUS_LABELS={BID_STATUS_LABELS}
        BID_LOSS_REASON_OPTIONS={BID_LOSS_REASON_OPTIONS}
        BID_WITHDRAWAL_REASON_OPTIONS={BID_WITHDRAWAL_REASON_OPTIONS}
      />
    </div>
  );
}
