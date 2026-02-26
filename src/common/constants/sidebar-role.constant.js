import { ORG_ROLE } from "./workspace-role.constant";

/**
 * Which sidebar sections/items are visible to which org roles.
 * - ORG_ADMIN: full access (workspace members, invites, everything)
 * - PROJECT_MANAGER: bid management, projects, daily updates, todos, kpis, account, workspace list, labels (no members/invites)
 * - Others (developer, qa, seo, business_developer): projects, daily updates, todos, kpis, account, workspace list, labels (no bid management, no members/invites)
 */

const ORG_ADMIN_ROLES = [ORG_ROLE.ORG_ADMIN];
const ORG_ADMIN_OR_PROJECT_MANAGER = [ORG_ROLE.ORG_ADMIN, ORG_ROLE.PROJECT_MANAGER];

export const SIDEBAR_VISIBILITY = Object.freeze({
  /** Todo Tracker, KPI Tracker: all roles */
  navItems: null,

  /** Bid Management section: org_admin, project_manager */
  bidManagement: ORG_ADMIN_OR_PROJECT_MANAGER,

  /** Projects: all roles */
  projects: null,

  /** Daily Updates: all roles */
  dailyUpdates: null,

  /** Settings > Account: all roles */
  account: null,

  /** Settings > Workspace (list, labels): all roles */
  workspaceList: null,
  workspaceLabels: null,

  /** Team members link: org_admin only */
  workspaceTeamMembers: ORG_ADMIN_ROLES,

  /** Pending invitations link: org_admin only */
  workspacePendingInvites: ORG_ADMIN_ROLES,

  /** Dashboard links (Projects, Bids, Daily Updates): org_admin only */
  dashboard: ORG_ADMIN_ROLES,
});

/** Returns true if the current org role is allowed for the given visibility rule (null = all roles). */
export function canSeeSidebarItem(orgRole, allowedRoles) {
  if (!allowedRoles) return true;
  const role = (orgRole || "").toLowerCase();
  return allowedRoles.some((r) => r === role);
}
