"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Building2,
  LogOut,
  ChevronDown,
  User,
  ChevronRight,
  Search,
  Bell,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/provider/features/auth/auth.slice";
import { fetchMembers } from "@/provider/features/organizations/organizations.slice";
import { getDisplayUser } from "@/common/utils/users.util";
import PendingInvitations from "@/components/pending-invitations/pending-invitations.component";
import NavbarInlineSearch from "@/components/global-search/navbar-inline-search.component";
import NotificationsCenter from "@/components/notifications-center/notifications-center.component";

const ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  BUSINESS_OWNER: "Business Owner",
  ADMIN: "Admin",
  admin: "Admin",
  owner: "Owner",
  member: "Member",
  guest: "Guest",
};

export default function AppNavbar({ title, onMenuClick }) {
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

  useEffect(() => {
    setUser(getDisplayUser());
  }, []);

  useEffect(() => {
    if (profileOpen && currentOrganizationId && user?.Id) {
      dispatch(
        fetchMembers({
          orgId: currentOrganizationId,
          successCallBack: (data) => {
            const me = (data || []).find(
              (m) => m.UserId === (user.Id || user.id),
            );
            setOrgRole(me?.Role ?? null);
          },
          errorCallBack: () => setOrgRole(null),
        }),
      );
    } else {
      setOrgRole(null);
    }
  }, [profileOpen, currentOrganizationId, user?.Id, user?.id, dispatch]);

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

  useEffect(() => {
    const closeNotifications = (e) => {
      const el = e.target?.closest?.("[data-notifications-container]");
      if (!el && notificationsOpen) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", closeNotifications);
    return () => document.removeEventListener("mousedown", closeNotifications);
  }, [notificationsOpen]);

  const handleLogout = async () => {
    setProfileOpen(false);
    await dispatch(logout());
    router.push("/");
  };

  const displayName =
    user?.FullName ||
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    (user?.Email || user?.email)?.split("@")[0] ||
    "Account";

  const roleLabel = orgRole ? ROLE_LABELS[orgRole] || orgRole : null;

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <NavbarInlineSearch />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <div
            className="relative"
            data-notifications-container
            ref={notificationsContainerRef}
          >
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-medium text-white">
                  {Math.min(unreadCount, 99)}
                </span>
              )}
            </button>
            <NotificationsCenter
              show={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />
          </div>
          <PendingInvitations />
          <div className="relative" ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex min-h-[44px] items-center gap-2 rounded-lg px-2 py-1.5 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden max-w-[120px] truncate typography-body font-medium text-neutral-900 sm:block">
                {displayName}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                <div className="px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {displayName}
                      </p>
                      {roleLabel && (
                        <p className="truncate text-xs text-neutral-500">
                          {roleLabel}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-t border-neutral-100">
                  <Link
                    href="/settings/account"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-0"
                  >
                    <User className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                    Account settings
                  </Link>
                  <Link
                    href="/settings/workspace"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-0"
                  >
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                    Manage workspace
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-0"
                  >
                    <LogOut className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

AppNavbar.propTypes = {
  title: PropTypes.string,
  onMenuClick: PropTypes.func,
};
