const ROLES = Object.freeze({
  SUPER_ADMIN: "SUPER_ADMIN",
  BUSINESS_OWNER: "BUSINESS_OWNER",
  ADMIN: "ADMIN",
});

/** Labels for workspace (org) roles shown in navbar etc. */
export const ROLE_LABELS = Object.freeze({
  org_admin: "Org Admin",
  developer: "Developer",
  project_manager: "Project Manager",
  quality_assurance_engineer: "QA Engineer",
  seo_specialist: "SEO Specialist",
  business_developer: "Business Developer",
});

export default ROLES;
