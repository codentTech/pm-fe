"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { useEffect } from "react";
import { isLoginVerified } from "@/common/utils/access-token.util";
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

export default function HomeLanding() {
  const router = useRouter();
  const loggedIn = typeof window !== "undefined" && isLoginVerified();

  useEffect(() => {
    if (loggedIn) router.replace("/projects");
  }, [loggedIn, router]);

  if (loggedIn) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white sm:mb-8 sm:h-14 sm:w-14 sm:rounded-2xl">
          <LayoutDashboard className="h-6 w-6 sm:h-8 sm:w-8" />
        </div>
        <h1 className="typography-h2 text-neutral-900 sm:typography-h1 sm:font-bold">
          Projects & KPIs
        </h1>
        <p className="mt-2 typography-body text-neutral-500 sm:text-base">
          Projects, lists, and cards. Track KPIs in one place.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <CustomButton
            text="Sign in"
            variant="primary"
            onClick={() => router.push("/login")}
            className="w-full rounded-lg px-6 py-2.5 typography-button sm:w-auto"
          />
          <CustomButton
            text="Create account"
            variant="secondary"
            onClick={() => router.push("/sign-up")}
            className="w-full rounded-lg px-6 py-2.5 typography-button sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
