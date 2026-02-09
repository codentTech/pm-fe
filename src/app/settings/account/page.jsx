"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings/account/profile");
  }, [router]);

  return null;
}
