/** Organization/workspace-level roles. ORG_ADMIN manages the org (members, settings). PROJECT_MANAGER manages projects. */
export const ORG_ROLE = Object.freeze({
  ORG_ADMIN: "org_admin",
  DEVELOPER: "developer",
  PROJECT_MANAGER: "project_manager",
  QUALITY_ASSURANCE_ENGINEER: "quality_assurance_engineer",
  SEO_SPECIALIST: "seo_specialist",
  BUSINESS_DEVELOPER: "business_developer",
});

/** Options for inviting (org_admin is assigned only when creating the org or by existing org admin, not via invite dropdown). */
export const WORKSPACE_ROLE_OPTIONS = Object.freeze([
  { label: "Developer", value: ORG_ROLE.DEVELOPER },
  { label: "Project Manager", value: ORG_ROLE.PROJECT_MANAGER },
  { label: "Quality Assurance Engineer", value: ORG_ROLE.QUALITY_ASSURANCE_ENGINEER },
  { label: "SEO Specialist", value: ORG_ROLE.SEO_SPECIALIST },
  { label: "Business Developer", value: ORG_ROLE.BUSINESS_DEVELOPER },
]);

export const WORKSPACE_ROLE_LABELS = Object.freeze({
  [ORG_ROLE.ORG_ADMIN]: "Org Admin",
  [ORG_ROLE.DEVELOPER]: "Developer",
  [ORG_ROLE.PROJECT_MANAGER]: "Project Manager",
  [ORG_ROLE.QUALITY_ASSURANCE_ENGINEER]: "Quality Assurance Engineer",
  [ORG_ROLE.SEO_SPECIALIST]: "SEO Specialist",
  [ORG_ROLE.BUSINESS_DEVELOPER]: "Business Developer",
});

/** Only the org admin can manage workspace (invite, remove members, change roles, update/delete org). */
export function canManageWorkspace(orgRole) {
  const role = (orgRole || "").toLowerCase();
  return role === ORG_ROLE.ORG_ADMIN;
}

export const LABEL_COLORS = Object.freeze([
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#6b7280",
  "#78716c",
  "#0f172a",
]);
