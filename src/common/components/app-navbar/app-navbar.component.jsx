"use client";

import { Bell, Building2, ChevronDown, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import PropTypes from "prop-types";

import NavbarInlineSearch from "@/components/global-search/navbar-inline-search.component";
import NotificationsCenter from "@/components/notifications-center/notifications-center.component";
import PendingInvitations from "@/components/pending-invitations/pending-invitations.component";
import { useAppNavbarLogic } from "./use-app-navbar.component";

export default function AppNavbar({ title, onMenuClick }) {
  const {
    profileOpen,
    notificationsOpen,
    unreadCount,
    displayName,
    roleLabel,
    superAdmin,
    setProfileOpen,
    setNotificationsOpen,
    profileDropdownRef,
    notificationsContainerRef,
    handleLogout,
  } = useAppNavbarLogic();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 sm:h-16 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <NavbarInlineSearch />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {/* Notifications */}
        <div
          className="relative"
          data-notifications-container
          ref={notificationsContainerRef}
        >
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
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

        {/* Profile */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex min-h-[44px] items-center gap-2 rounded-lg px-2 py-1.5 text-neutral-700 hover:bg-neutral-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <User className="h-4 w-4" />
            </div>

            <span className="hidden max-w-[120px] truncate typography-body font-medium text-neutral-900 sm:block">
              {displayName}
            </span>

            <ChevronDown
              className={`h-4 w-4 text-neutral-500 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
              <div className="px-2.5 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-600">
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
                  className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <User className="h-3.5 w-3.5 text-neutral-500" />
                  Account settings
                </Link>

                <Link
                  href={
                    superAdmin
                      ? "/super-admin/organizations"
                      : "/settings/workspace"
                  }
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <Building2 className="h-3.5 w-3.5 text-neutral-500" />
                  Manage workspace
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <LogOut className="h-3.5 w-3.5 text-neutral-500" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

AppNavbar.propTypes = {
  title: PropTypes.string,
  onMenuClick: PropTypes.func,
};
