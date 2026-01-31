"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isLoginVerified } from "@/common/utils/access-token.util";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (isLoginVerified()) {
      router.replace("/boards");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
