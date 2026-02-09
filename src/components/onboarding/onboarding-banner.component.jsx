"use client";

import PropTypes from "prop-types";
import { LayoutGrid, CheckSquare, BarChart3, ArrowRight } from "lucide-react";
import useOnboardingBanner from "./use-onboarding-banner.hook";

/**
 * Onboarding banner shown to first-time users (no projects yet).
 */
export default function OnboardingBanner({ hasProjects }) {
  const { visible } = useOnboardingBanner(hasProjects);

  if (!visible) return null;

  const steps = [
    { icon: LayoutGrid, label: "Create a project" },
    { icon: CheckSquare, label: "Add todo lists" },
    { icon: BarChart3, label: "Track KPIs" },
  ];

  return (
    <div
      className="mb-4 rounded-lg border border-neutral-200 bg-neutral-50/60 px-4 py-3"
      role="region"
      aria-label="Get started"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="min-w-0">
          <h2 className="typography-body font-semibold text-neutral-800">
            Get started in 3 steps
          </h2>
          <p className="mt-0.5 typography-caption text-neutral-600">
            Create a project, add todo lists, and track KPIs.
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-x-2 gap-y-1 sm:gap-x-3">
          {steps.map(({ icon: Icon, label }, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <ArrowRight className="h-3 w-3 shrink-0 text-neutral-300" />
              )}
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary-100 text-primary-600">
                <Icon className="h-3 w-3" />
              </span>
              <span className="typography-caption font-medium text-neutral-700">
                {i + 1}. {label}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

OnboardingBanner.propTypes = {
  hasProjects: PropTypes.bool,
};
