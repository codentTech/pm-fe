"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isLoginVerified } from "@/common/utils/access-token.util";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (isLoginVerified()) {
      router.replace("/projects");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
