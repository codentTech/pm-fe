"use client";

import { logout } from "@/provider/features/auth/auth.slice";
import {
  BarChart3,
  Briefcase,
  Building2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  List,
  Lock,
  LogOut,
  Mail,
  Menu,
  PanelsTopLeft,
  Settings,
  Tag,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const navItems = [
  { href: "/projects", label: "Projects", icon: PanelsTopLeft },
  { href: "/todos", label: "Todo Tracker", icon: CheckSquare },
  { href: "/kpis", label: "KPI Tracker", icon: BarChart3 },
];

const projectItems = [
  { href: "/projects/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: List },
];

const bidItems = [
  { href: "/bids/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/bids/all", label: "All bids", icon: Briefcase },
  { href: "/bids/backlogs", label: "Backlogs", icon: CheckSquare },
  { href: "/bids/new", label: "Log bid", icon: ClipboardCheck },
];

const dailyUpdateItems = [
  { href: "/daily-updates/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/daily-updates/updates", label: "Updates", icon: ClipboardCheck },
  { href: "/daily-updates/backlogs", label: "Backlogs", icon: CheckSquare },
  { href: "/daily-updates/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/daily-updates/new", label: "Submit update", icon: ClipboardCheck },
];

const accountItems = [
  { href: "/settings/account/profile", label: "Profile", icon: User },
  { href: "/settings/account/security", label: "Security", icon: Lock },
];

const workspaceItems = (currentOrgId) => [
  { href: "/settings/workspace", label: "Workspace list", icon: Building2 },
  {
    href: currentOrgId
      ? `/settings/workspace/${currentOrgId}/members`
      : "/settings/workspace",
    label: "Team members",
    icon: Users,
  },
  {
    href: currentOrgId
      ? `/settings/workspace/${currentOrgId}/invites`
      : "/settings/workspace",
    label: "Pending invitations",
    icon: Mail,
  },
  {
    href: currentOrgId
      ? `/settings/workspace/${currentOrgId}/labels`
      : "/settings/workspace",
    label: "Labels",
    icon: Tag,
  },
];

export default function AppSidebar({ onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { organizations, currentOrganizationId } = useSelector(
    (state) => state.organizations || {},
  );
  const currentWorkspace = organizations?.find(
    (o) => o.Id === currentOrganizationId,
  );

  const [settingsExpanded, setSettingsExpanded] = useState(
    pathname?.startsWith("/settings"),
  );
  const [bidsExpanded, setBidsExpanded] = useState(
    pathname?.startsWith("/bids"),
  );
  const [dailyUpdatesExpanded, setDailyUpdatesExpanded] = useState(
    pathname?.startsWith("/daily-updates"),
  );
  const [accountExpanded, setAccountExpanded] = useState(
    pathname?.startsWith("/settings/account"),
  );
  const [workspaceExpanded, setWorkspaceExpanded] = useState(
    pathname?.startsWith("/settings/workspace"),
  );
  const [projectExpanded, setProjectExpanded] = useState(
    pathname?.startsWith("/projects"),
  );

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/");
  };

  return (
    <aside className="flex h-full flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 bg-gradient-to-b from-neutral-50 to-white px-3 py-4">
        <div className="flex h-[31px] items-center gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 focus:outline-none md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            href="/projects"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-neutral-100 focus:outline-none"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-sm">
              <PanelsTopLeft className="h-4 w-4" />
            </div>
            <span className="truncate text-sm font-semibold text-neutral-900">
              {currentWorkspace?.Name || "Workspace"}
            </span>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <nav className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/" && pathname?.startsWith(href + "/"));
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-h-[40px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}

          {/* Bid Management Module */}
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setBidsExpanded(!bidsExpanded)}
              className={`flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none ${
                pathname?.startsWith("/bids")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
              }`}
            >
              <Briefcase className="h-4 w-4 shrink-0" aria-hidden />
              <span className="flex-1 text-left">Bid Management</span>
              {bidsExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
            </button>

            {bidsExpanded && (
              <div className="mt-1 space-y-0.5 border-l-2 border-neutral-200 pl-3 ml-3">
                {bidItems.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex min-h-[34px] items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none ${
                        isActive
                          ? "bg-indigo-50 font-medium text-indigo-600"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Project Submodule */}
            <div className="mt-1">
              <button
                type="button"
                onClick={() => setProjectExpanded(!projectExpanded)}
                className={`flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none ${
                  pathname?.startsWith("/projects")
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
                <span className="flex-1 text-left">Projects</span>
                {projectExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
              </button>

              {projectExpanded && (
                <div className="mt-1 space-y-0.5 border-l-2 border-neutral-200 pl-3 ml-3">
                  {projectItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex min-h-[34px] items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none ${
                          isActive
                            ? "bg-indigo-50 font-medium text-indigo-600"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Daily Updates Module */}
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setDailyUpdatesExpanded(!dailyUpdatesExpanded)}
              className={`flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none ${
                pathname?.startsWith("/daily-updates")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
              }`}
            >
              <ClipboardCheck className="h-4 w-4 shrink-0" aria-hidden />
              <span className="flex-1 text-left">Daily Updates</span>
              {dailyUpdatesExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
            </button>

            {dailyUpdatesExpanded && (
              <div className="mt-1 space-y-0.5 border-l-2 border-neutral-200 pl-3 ml-3">
                {dailyUpdateItems.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex min-h-[34px] items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none ${
                        isActive
                          ? "bg-indigo-50 font-medium text-indigo-600"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Settings Module */}
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setSettingsExpanded(!settingsExpanded)}
              className={`flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none ${
                pathname?.startsWith("/settings")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
              }`}
            >
              <Settings className="h-4 w-4 shrink-0" aria-hidden />
              <span className="flex-1 text-left">Settings</span>
              {settingsExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
            </button>

            {/* Settings Submodules */}
            {settingsExpanded && (
              <div className="mt-1 space-y-1 border-l-2 border-neutral-200 pl-3 ml-3">
                {/* Account Submodule */}
                <div>
                  <button
                    type="button"
                    onClick={() => setAccountExpanded(!accountExpanded)}
                    className={`flex min-h-[36px] w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none ${
                      pathname?.startsWith("/settings/account")
                        ? "bg-indigo-50 font-medium text-indigo-600"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                    }`}
                  >
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1 text-left">Account</span>
                    {accountExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    )}
                  </button>

                  {/* Account Items */}
                  {accountExpanded && (
                    <div className="mt-1 space-y-0.5 border-l-2 border-neutral-200 pl-3 ml-3">
                      {accountItems.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          className={`flex min-h-[34px] items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none ${
                            pathname === href
                              ? "bg-indigo-50 font-medium text-indigo-600"
                              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          {label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Workspace Submodule */}
                <div>
                  <button
                    type="button"
                    onClick={() => setWorkspaceExpanded(!workspaceExpanded)}
                    className={`flex min-h-[36px] w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none ${
                      pathname?.startsWith("/settings/workspace")
                        ? "bg-indigo-50 font-medium text-indigo-600"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                    }`}
                  >
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1 text-left">Workspace</span>
                    {workspaceExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    )}
                  </button>

                  {/* Workspace Items */}
                  {workspaceExpanded && (
                    <div className="mt-1 space-y-0.5 border-l-2 border-neutral-200 pl-3 ml-3">
                      {workspaceItems(currentOrganizationId).map(
                        ({ href, label, icon: Icon }) => {
                          const isActive =
                            href === "/settings/workspace"
                              ? pathname === "/settings/workspace"
                              : pathname === href;
                          return (
                            <Link
                              key={label}
                              href={href}
                              className={`flex min-h-[34px] items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none ${
                                isActive
                                  ? "bg-indigo-50 font-medium text-indigo-600"
                                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              {label}
                            </Link>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="border-t border-neutral-200 bg-neutral-50/50 p-2">
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-800 focus:outline-none"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          Log out
        </button>
      </div>
    </aside>
  );
}

AppSidebar.propTypes = {
  onMenuClick: PropTypes.func,
};
