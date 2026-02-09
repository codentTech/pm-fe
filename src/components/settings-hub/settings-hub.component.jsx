"use client";

import Link from "next/link";
import { Building2, ChevronRight, Lock, User } from "lucide-react";

const SETTINGS_SECTIONS = [
  {
    href: "/settings/account/profile",
    label: "Profile",
    description: "Update your name and personal information",
    icon: User,
  },
  {
    href: "/settings/account/security",
    label: "Security",
    description: "Change your password and security preferences",
    icon: Lock,
  },
  {
    href: "/settings/workspace",
    label: "Workspace",
    description: "Organizations, members, invitations, and labels",
    icon: Building2,
  },
];

export default function SettingsHub() {
  const SEPARATOR_COLORS = [
    "from-indigo-500 to-indigo-700",
    "from-emerald-500 to-emerald-700",
    "from-amber-500 to-amber-700",
    "from-rose-500 to-rose-700",
    "from-sky-500 to-sky-700",
    "from-violet-500 to-violet-700",
  ];

  return (
    <div className="min-h-full">
      <div className="page-header-bar p-4 sm:p-5">
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">
            Settings
          </h1>
          <p className="page-header-subtitle">
            Manage your account and workspace preferences.
          </p>
        </div>
      </div>
      <div className="page-separator" aria-hidden>
        <span className="page-separator-line" />
        <span className="flex gap-1">
          {SEPARATOR_COLORS.map((color, i) => (
            <span key={i} className={`page-separator-dot bg-gradient-to-br ${color}`} />
          ))}
        </span>
        <span className="page-separator-line" />
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        {SETTINGS_SECTIONS.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50 outline-none"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="typography-body font-semibold text-neutral-900">
                {label}
              </h2>
              <p className="typography-caption text-neutral-500">
                {description}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-neutral-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
