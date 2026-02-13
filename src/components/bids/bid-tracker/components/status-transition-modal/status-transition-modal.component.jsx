"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";

export default function StatusTransitionModal({
  show,
  onClose,
  statusModalBid,
  statusForm,
  statusError,
  handleStatusChange,
  submitStatusTransition,
  transitionBidStatusState,
  BID_STATUS_LABELS,
  BID_LOSS_REASON_OPTIONS,
  BID_WITHDRAWAL_REASON_OPTIONS,
}) {
  return (
    <Modal show={show} onClose={onClose} title="Change bid status" size="lg">
      <div className="space-y-4">
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Status change
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                Review the current status and confirm the next state.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="rounded-lg border border-indigo-200 bg-white px-3 py-1 text-indigo-700">
                {statusModalBid
                  ? BID_STATUS_LABELS[statusModalBid.CurrentStatus] ||
                    statusModalBid.CurrentStatus
                  : "—"}
              </span>
              <span className="text-indigo-400">→</span>
              <span className="rounded-lg bg-indigo-600 px-3 py-1 text-white">
                {BID_STATUS_LABELS[statusForm.Status] ||
                  statusForm.Status ||
                  "—"}
              </span>
            </div>
          </div>
        </div>

        {statusForm.Status === "interview" && (
          <CustomInput
            label="Interview date"
            type="date"
            value={statusForm.InterviewDate}
            onChange={(e) =>
              handleStatusChange("InterviewDate", e.target.value)
            }
            isRequired
          />
        )}

        {statusForm.Status === "lost" && (
          <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
            <SimpleSelect
              label="Loss reason"
              options={BID_LOSS_REASON_OPTIONS}
              value={statusForm.LossReason}
              onChange={(value) => handleStatusChange("LossReason", value)}
              placeholder="Select reason…"
            />
            {statusForm.LossReason === "other" && (
              <TextArea
                label="Loss reason details"
                value={statusForm.LossReasonOther}
                onChange={(e) =>
                  handleStatusChange("LossReasonOther", e.target.value)
                }
              />
            )}
          </div>
        )}

        {statusForm.Status === "withdrawn" && (
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <SimpleSelect
              label="Withdrawal reason"
              options={BID_WITHDRAWAL_REASON_OPTIONS}
              value={statusForm.WithdrawalReason}
              onChange={(value) =>
                handleStatusChange("WithdrawalReason", value)
              }
              placeholder="Select reason…"
            />
          </div>
        )}

        {statusForm.Status === "won" && (
          <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
            <CustomInput
              label="Final agreed price"
              type="number"
              value={statusForm.FinalAgreedPrice}
              onChange={(e) =>
                handleStatusChange("FinalAgreedPrice", e.target.value)
              }
              isRequired
            />
            <CustomInput
              label="Expected start date"
              type="date"
              value={statusForm.ExpectedStartDate}
              onChange={(e) =>
                handleStatusChange("ExpectedStartDate", e.target.value)
              }
              isRequired
            />
            <TextArea
              label="Final scope notes"
              value={statusForm.FinalScopeNotes}
              onChange={(e) =>
                handleStatusChange("FinalScopeNotes", e.target.value)
              }
            />
          </div>
        )}

        {statusModalBid?.CurrentStatus === "interview" &&
          ["won", "lost", "ghosted", "withdrawn"].includes(
            statusForm.Status,
          ) && (
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <TextArea
                label="Interview outcome"
                value={statusForm.InterviewOutcome}
                onChange={(e) =>
                  handleStatusChange("InterviewOutcome", e.target.value)
                }
              />
            </div>
          )}

        <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4">
          <CustomButton
            type="button"
            text="Cancel"
            variant="cancel"
            onClick={onClose}
          />
          <CustomButton
            type="button"
            text="Update Status"
            variant="primary"
            loading={transitionBidStatusState?.isLoading}
            onClick={submitStatusTransition}
          />
        </div>
      </div>
    </Modal>
  );
}
