"use client";

import { Mail } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import usePendingInvitations from "./use-pending-invitations.hook";

export default function PendingInvitations() {
  const {
    count,
    open,
    pendingForMe,
    dropdownRef,
    acceptingToken,
    decliningToken,
    toggleOpen,
    handleAccept,
    handleDecline,
  } = usePendingInvitations();

  if (count === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className="relative flex items-center justify-center rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none"
        aria-label={`${count} pending invitation${count > 1 ? "s" : ""}`}
      >
        <Mail className="h-5 w-5" />
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary-600 px-1 typography-caption font-semibold text-white">
          {count}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-80 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
          <div className="border-b border-neutral-100 bg-neutral-50/50 px-4 py-3">
            <h3 className="typography-body font-semibold text-neutral-900">
              Pending invitations
            </h3>
            <p className="mt-0.5 typography-caption text-neutral-500">
              You have {count} workspace invitation{count > 1 ? "s" : ""}
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {pendingForMe?.map((inv) => (
              <div
                key={inv.Id}
                className="flex items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3 last:border-0 hover:bg-neutral-50/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate typography-body font-medium text-neutral-800">
                    {inv.Organization?.Name || "Workspace"}
                  </p>
                  <p className="typography-caption text-neutral-500">
                    Invited as {inv.Role || "member"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <CustomButton
                    type="button"
                    text="Accept"
                    variant="primary"
                    size="sm"
                    className="!min-w-0 !px-3 !py-1.5 typography-caption"
                    onClick={() => handleAccept(inv)}
                    loading={acceptingToken === inv.Token}
                    disabled={acceptingToken || decliningToken}
                  />
                  <CustomButton
                    type="button"
                    text="Decline"
                    variant="cancel"
                    size="sm"
                    className="!min-w-0 !px-3 !py-1.5 typography-caption"
                    onClick={() => handleDecline(inv)}
                    loading={decliningToken === inv.Token}
                    disabled={acceptingToken || decliningToken}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
