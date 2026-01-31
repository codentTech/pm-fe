"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { BarChart3, LogOut, Menu, PanelsTopLeft, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/provider/features/auth/auth.slice";
import { APP_NAME } from "@/common/theme/theme.constants";

const navItems = [
  { href: "/boards", label: "Boards", icon: PanelsTopLeft },
  { href: "/kpis", label: "KPI Tracker", icon: BarChart3 },
];

export default function AppSidebar({ onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/");
  };

  return (
    <aside className="flex h-full flex-col border-r border-neutral-200 bg-neutral-50/80">
      <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-3 py-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href="/boards"
          className="flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-200/80"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-600 text-white">
            <PanelsTopLeft className="h-4 w-4" />
          </div>
          <span className="truncate text-base font-semibold text-neutral-800">
            {APP_NAME}
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Workspace
        </p>
        <nav className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "text-neutral-700 hover:bg-neutral-200/80 hover:text-neutral-900"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}
          <Link
            href="/boards?openCreate=1"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200/80 hover:text-neutral-900"
          >
            <Plus className="h-5 w-5 shrink-0" />
            Create board
          </Link>
        </nav>
      </div>

      <div className="border-t border-neutral-200 p-2">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200/80 hover:text-neutral-900"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Log out
        </button>
      </div>
    </aside>
  );
}

AppSidebar.propTypes = {
  onMenuClick: PropTypes.func,
};
