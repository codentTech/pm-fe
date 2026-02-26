"use client";

import Link from "next/link";
import { Building2, ChevronRight, Lock, User } from "lucide-react";
import PageHeader from "@/common/components/page-header/page-header.component";

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
  return (
    <div className="min-h-full">
      <PageHeader
        title="Settings"
        subtitle="Manage your account and workspace preferences."
        className="p-4 sm:p-5"
      />
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
