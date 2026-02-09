"use client";

import { useRouter } from "next/navigation";

export default function useInvitationAccept({
  token,
  isLoggedIn,
  invitation,
  preview,
  fetchState,
  previewLoading,
  previewError,
}) {
  // stats
  const router = useRouter();
  const isLoading =
    (isLoggedIn && (fetchState?.isLoading || (token && !invitation))) ||
    previewLoading;
  const hasInvitation = isLoggedIn && invitation;
  const hasPreview = !isLoggedIn && preview;
  const isInvalid =
    !token ||
    (isLoggedIn && !fetchState?.isLoading && !invitation && token) ||
    (!isLoggedIn && !previewLoading && !preview && token);

  const displayData = hasInvitation
    ? {
        organizationName: invitation?.Organization?.Name ?? "Workspace",
        inviterName: invitation?.CreatedBy?.FullName ?? "Someone",
        role: invitation?.Role ?? "member",
      }
    : hasPreview
      ? {
          organizationName: preview?.organizationName ?? "Workspace",
          inviterName: preview?.inviterName ?? "Someone",
          role: preview?.role ?? "member",
        }
      : null;

  const loginUrl = token
    ? `/login?returnUrl=${encodeURIComponent(`/invitations?token=${token}`)}`
    : "/login";
  const signUpUrl = token
    ? `/sign-up?returnUrl=${encodeURIComponent(`/invitations?token=${token}`)}`
    : "/sign-up";

  // functions
  function handleGoToLogin() {
    router.push("/login");
  }

  function handleGoToDashboard() {
    router.push("/dashboard");
  }

  function handleGoToSignIn() {
    router.push(loginUrl);
  }

  function handleGoToSignUp() {
    router.push(signUpUrl);
  }

  return {
    isLoading,
    hasInvitation,
    hasPreview,
    isInvalid,
    displayData,
    loginUrl,
    signUpUrl,
    handleGoToLogin,
    handleGoToDashboard,
    handleGoToSignIn,
    handleGoToSignUp,
  };
}
