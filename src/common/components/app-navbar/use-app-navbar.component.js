"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getDisplayUser } from "@/common/utils/users.util";
import { isSuperAdmin } from "@/common/utils/users.util";
import { logout } from "@/provider/features/auth/auth.slice";
import { fetchMembers } from "@/provider/features/organizations/organizations.slice";
import ROLES, { ROLE_LABELS } from "@/common/constants/role.constant";

export function useAppNavbarLogic() {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentOrganizationId = useSelector(
    (s) => s.organizations?.currentOrganizationId,
  );

  const unreadCount = useSelector((s) => s.notifications?.unreadCount) ?? 0;

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [orgRole, setOrgRole] = useState(null);

  const profileDropdownRef = useRef(null);
  const notificationsContainerRef = useRef(null);

  /* ---------- User ---------- */
  useEffect(() => {
    setUser(getDisplayUser());
  }, []);

  /* ---------- Org Role ---------- */
  useEffect(() => {
    if (!currentOrganizationId) return;
    dispatch(
      fetchMembers({
        orgId: currentOrganizationId,
        successCallBack: (data) => {
          const me = (data || []).find(
            (m) => m.UserId === (user.Id || user.id),
          );
          setOrgRole(me?.Role);
        },
        errorCallBack: () => setOrgRole(null),
      }),
    );
  }, [profileOpen, currentOrganizationId, user?.Id, user?.id, dispatch]);

  /* ---------- Outside Click (Profile) ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- Outside Click (Notifications) ---------- */
  useEffect(() => {
    const closeNotifications = (e) => {
      const el = e.target?.closest?.("[data-notifications-container]");
      if (!el && notificationsOpen) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", closeNotifications);
    return () => document.removeEventListener("mousedown", closeNotifications);
  }, [notificationsOpen]);

  /* ---------- Handlers ---------- */
  const handleLogout = async () => {
    setProfileOpen(false);
    await dispatch(logout());
    router.push("/");
  };

  /* ---------- Derived Data ---------- */
  const displayName =
    user?.FullName ||
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    (user?.Email || user?.email)?.split("@")[0] ||
    "Account";

  const roleLabel =
    user?.SystemRole === ROLES.SUPER_ADMIN
      ? "Super Admin"
      : orgRole
        ? ROLE_LABELS[(orgRole || "").toLowerCase()] || orgRole
        : null;
  const superAdmin = isSuperAdmin();

  return {
    // state
    profileOpen,
    notificationsOpen,
    unreadCount,
    displayName,
    roleLabel,
    superAdmin,

    // setters
    setProfileOpen,
    setNotificationsOpen,

    // refs
    profileDropdownRef,
    notificationsContainerRef,

    // handlers
    handleLogout,
  };
}
