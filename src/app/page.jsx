"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { useEffect } from "react";
import { isLoginVerified } from "@/common/utils/access-token.util";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/common/theme/theme.constants";
import { LayoutDashboard } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const loggedIn = typeof window !== "undefined" && isLoginVerified();

  useEffect(() => {
    if (loggedIn) router.replace("/boards");
  }, [loggedIn, router]);

  if (loggedIn) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50/50 px-6 py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-500/25">
          <LayoutDashboard className="h-9 w-9" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          {APP_NAME}
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Organize work with boards, lists, and cards. Track KPIs in one place.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CustomButton
            text="Sign in"
            variant="primary"
            onClick={() => router.push("/login")}
            className="w-full rounded-xl px-8 py-3 text-base font-medium sm:w-auto"
          />
          <CustomButton
            text="Create account"
            variant="secondary"
            onClick={() => router.push("/sign-up")}
            className="w-full rounded-xl px-8 py-3 text-base font-medium sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
