"use client";

import { Mail, Users } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import useInvitationAccept from "./use-invitation-accept.hook";

export default function InvitationAcceptPage({
  token,
  isLoggedIn,
  invitation,
  preview,
  fetchState,
  previewLoading,
  previewError,
  acceptingToken,
  decliningToken,
  onAccept,
  onDecline,
}) {
  const {
    isLoading,
    isInvalid,
    displayData,
    handleGoToLogin,
    handleGoToDashboard,
    handleGoToSignIn,
    handleGoToSignUp,
  } = useInvitationAccept({
    token,
    isLoggedIn,
    invitation,
    preview,
    fetchState,
    previewLoading,
    previewError,
  });

  return (
    <>
      {!token && (
        <div className="form-wrapper">
          <div className="form-container">
            <div className="form-card text-center py-12">
              <NoResultFound
                title="No invitation"
                description="No invitation token provided. Check your email for the invitation link."
              />
              <CustomButton
                text="Go to Sign in"
                variant="primary"
                className="mt-6 w-full rounded-lg py-2.5 sm:w-auto sm:min-w-[140px]"
                onClick={handleGoToLogin}
              />
            </div>
          </div>
        </div>
      )}

      {token && isLoading && (
        <div className="form-wrapper">
          <div className="form-container">
            <div className="form-card flex min-h-[280px] items-center justify-center py-12">
              <Loader />
            </div>
          </div>
        </div>
      )}

      {token && !isLoading && isInvalid && (
        <div className="form-wrapper">
          <div className="form-container">
            <div className="form-card text-center py-12">
              <NoResultFound
                title="Invitation not found or expired"
                description={
                  previewError ||
                  "This invitation may have expired, already been accepted, or the link is invalid."
                }
              />
              <CustomButton
                text={isLoggedIn ? "Go to Dashboard" : "Go to Sign in"}
                variant="primary"
                onClick={isLoggedIn ? handleGoToDashboard : handleGoToLogin}
              />
            </div>
          </div>
        </div>
      )}

      {token && !isLoading && !isInvalid && displayData && (
        <div className="form-wrapper">
          <div className="form-container">
            <div className="form-card">
              <div className="mb-6 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600">
                  <Mail className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="form-header text-center">
                <p className="bg-primary-600 text-white rounded-lg p-2">
                  You&apos;ve been invited to join{" "}
                  <span className="font-semibold text-yellow-200">
                    {displayData.organizationName}
                  </span>{" "}
                  as a {displayData.role}
                </p>
                {displayData.inviterName && (
                  <p className="my-4 flex flex-wrap items-center justify-center gap-x-1 typography-caption text-neutral-900">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4 shrink-0 text-primary-600" />
                      <span className="text-primary-600">
                        {displayData.inviterName}
                      </span>
                    </span>
                    <span>sent this invitation</span>
                  </p>
                )}
              </div>

              {isLoggedIn ? (
                <div className="mt-4 flex flex-col gap-3">
                  <CustomButton
                    text="Accept invitation"
                    variant="primary"
                    loading={!!acceptingToken}
                    disabled={!!acceptingToken || !!decliningToken}
                    onClick={onAccept}
                  />
                  <CustomButton
                    text="Decline"
                    variant="outline"
                    loading={!!decliningToken}
                    disabled={!!acceptingToken || !!decliningToken}
                    onClick={onDecline}
                  />
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  <CustomButton
                    text="Sign in"
                    variant="outline"
                    onClick={handleGoToSignIn}
                  />
                  <CustomButton
                    text="Create account"
                    variant="primary"
                    onClick={handleGoToSignUp}
                  />
                  <p className="text-center typography-caption text-neutral-500">
                    Sign in or create an account to accept or decline this
                    invitation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
