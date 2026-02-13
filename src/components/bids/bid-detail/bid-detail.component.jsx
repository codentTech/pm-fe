"use client";

import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BID_STATUS_LABELS } from "@/common/constants/bid.constant";
import { KPI_SEPARATOR_COLORS } from "@/common/constants/colors.constant";
import { formatDate } from "@/common/utils/date.util";
import useBidDetail from "./use-bid-detail.hook";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { createProjectFromBid } from "@/provider/features/projects/projects.slice";

export default function BidDetail({ bidId }) {
  const { bid, fetchState } = useBidDetail(bidId);
  const dispatch = useDispatch();
  const router = useRouter();
  const createProjectState = useSelector(
    (state) => state?.projects?.createProjectFromBid
  );

  if (fetchState?.isLoading) {
    return <div className="p-6 text-sm text-neutral-600">Loading bid</div>;
  }

  if (fetchState?.isError) {
    return (
      <div className="p-6 text-sm text-danger-600">
        {fetchState?.message || "Failed to load bid"}
      </div>
    );
  }

  if (!bid) {
    return (
      <div className="p-6">
        <NoResultFound
          icon={FileQuestion}
          title="Bid not found"
          description="This bid may have been removed or you no longer have access."
          variant="compact"
        />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col bg-white">
      <div className="sticky top-0 z-10 page-header-bar">
        <Link
          href="/bids"
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 typography-body font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Bids</span>
        </Link>
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="truncate font-bold typography-h4 !text-indigo-600 sm:typography-h3">
            {bid.BidTitle}
          </h1>
          <p className="truncate text-sm text-neutral-600">
            {bid.ClientDisplayName}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
            {BID_STATUS_LABELS[bid.CurrentStatus] || bid.CurrentStatus || "—"}
          </span>
          {bid.CurrentStatus === "won" && (
            <CustomButton
              text="Create project"
              variant="primary"
              size="sm"
              loading={createProjectState?.isLoading}
              onClick={() =>
                dispatch(
                  createProjectFromBid({
                    bidId: bid.Id,
                    successCallBack: (project) =>
                      router.push(`/projects/${project.Id}`),
                  })
                )
              }
            />
          )}
        </div>
      </div>

      <div className="page-separator" aria-hidden>
        <span className="page-separator-line" />
        <span className="flex gap-1">
          {KPI_SEPARATOR_COLORS.map((color, i) => (
            <span
              key={i}
              className={`page-separator-dot bg-gradient-to-br ${color}`}
            />
          ))}
        </span>
        <span className="page-separator-line" />
      </div>

      <div className="px-4 sm:px-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
            <h3 className="text-sm font-bold text-indigo-600">Overview</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <div className="text-neutral-500">Status</div>
                <div className="font-medium">
                  {BID_STATUS_LABELS[bid.CurrentStatus] ||
                    bid.CurrentStatus ||
                    "—"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Platform</div>
                <div className="font-medium capitalize">
                  {bid.Platform || "—"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Job URL / Reference</div>
                <div className="font-medium break-all">
                  {bid.JobUrlOrReference || "—"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Submission date</div>
                <div className="font-medium">
                  {formatDate(bid.SubmissionDate)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
            <h3 className="text-sm font-bold text-indigo-600">
              Pricing & Effort
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <div className="text-neutral-500">Proposed price</div>
                <div className="font-medium">
                  {bid.Currency}{" "}
                  {Number(bid.ProposedPrice ?? 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Estimated effort</div>
                <div className="font-medium">
                  {bid.EstimatedEffort ?? "—"} hrs
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Probability</div>
                <div className="font-medium">
                  {bid.Probability !== null && bid.Probability !== undefined
                    ? bid.Probability
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Skills / Tags</div>
                <div className="font-medium">
                  {Array.isArray(bid.SkillsTags) && bid.SkillsTags.length
                    ? bid.SkillsTags.join(", ")
                    : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
            <h3 className="text-sm font-bold text-indigo-600">Interview</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <div className="text-neutral-500">Interview date</div>
                <div className="font-medium">
                  {formatDate(bid.InterviewDate)}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Interview outcome</div>
                <div className="font-medium">{bid.InterviewOutcome || "—"}</div>
              </div>
              <div>
                <div className="text-neutral-500">Loss reason</div>
                <div className="font-medium">{bid.LossReason || "—"}</div>
              </div>
              <div>
                <div className="text-neutral-500">Withdrawal reason</div>
                <div className="font-medium">{bid.WithdrawalReason || "—"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
            <h3 className="text-sm font-bold text-indigo-600">Final Outcome</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <div className="text-neutral-500">Final agreed price</div>
                <div className="font-medium">
                  {bid.FinalAgreedPrice != null
                    ? `${bid.Currency} ${Number(bid.FinalAgreedPrice).toLocaleString()}`
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Expected start date</div>
                <div className="font-medium">
                  {formatDate(bid.ExpectedStartDate)}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Final scope notes</div>
                <div className="font-medium">{bid.FinalScopeNotes || "—"}</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
            <h3 className="text-sm font-bold text-indigo-600">Notes</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <div className="text-neutral-500">Internal comments</div>
                <div className="font-medium">{bid.InternalComments || "—"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
