"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminAccountPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/super-admin/account/profile");
  }, [router]);

  return null;
}
