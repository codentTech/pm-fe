"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import { isLoginVerified } from "@/common/utils/access-token.util";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingForMe,
  acceptInvitation,
  declineInvitation,
} from "@/provider/features/invitations/invitations.slice";
import invitationsService from "@/provider/features/invitations/invitations.service";
import {
  fetchOrganizations,
  setCurrentOrganization,
} from "@/provider/features/organizations/organizations.slice";
import { fetchBoards } from "@/provider/features/boards/boards.slice";
import { fetchKpis } from "@/provider/features/kpis/kpis.slice";
import InvitationAcceptPage from "@/components/invitation-accept/invitation-accept.component";

export default function InvitationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const dispatch = useDispatch();
  const { pendingForMe, fetchPendingForMe: fetchState } = useSelector(
    (state) => state.invitations
  );
  const [acceptingToken, setAcceptingToken] = useState(null);
  const [decliningToken, setDecliningToken] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(null);

  const isLoggedIn = typeof window !== "undefined" && isLoginVerified();

  useEffect(() => {
    if (!token && isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [token, isLoggedIn, router]);

  useEffect(() => {
    if (!token) {
      setPreviewLoading(false);
      return;
    }
    if (isLoggedIn) {
      setPreviewLoading(false);
      dispatch(fetchPendingForMe());
      return;
    }
    setPreviewLoading(true);
    setPreviewError(null);
    invitationsService
      .getInvitationPreview(token)
      .then((res) => {
        if (res?.success && res?.data) {
          setPreview(res.data);
        } else {
          setPreview(null);
          setPreviewError("Invitation not found or expired");
        }
      })
      .catch(() => {
        setPreview(null);
        setPreviewError("Failed to load invitation");
      })
      .finally(() => setPreviewLoading(false));
  }, [isLoggedIn, token]);

  const invitation = pendingForMe?.find((inv) => inv.Token === token);

  async function handleAccept() {
    if (!token) return;
    setAcceptingToken(token);
    await dispatch(
      acceptInvitation({
        token,
        successCallBack: () => {
          if (invitation?.Organization?.Id) {
            dispatch(setCurrentOrganization(invitation.Organization.Id));
            dispatch(fetchOrganizations());
            dispatch(fetchBoards());
            dispatch(fetchKpis());
          }
          router.replace("/dashboard");
        },
      })
    );
    setAcceptingToken(null);
  }

  async function handleDecline() {
    if (!token) return;
    setDecliningToken(token);
    await dispatch(
      declineInvitation({
        token,
        successCallBack: () => router.replace("/dashboard"),
      })
    );
    setDecliningToken(null);
  }

  return (
    <Auth
      component={
        <InvitationAcceptPage
          token={token}
          isLoggedIn={isLoggedIn}
          invitation={invitation}
          preview={preview}
          fetchState={fetchState}
          previewLoading={previewLoading}
          previewError={previewError}
          acceptingToken={acceptingToken}
          decliningToken={decliningToken}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      }
      type={AUTH.PUBLIC}
      title={NAVBAR_TITLE.DOCUMENTS}
    />
  );
}
