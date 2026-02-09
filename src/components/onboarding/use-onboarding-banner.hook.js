"use client";

export default function useOnboardingBanner(hasProjects) {
  const visible = !hasProjects;
  return { visible };
}
