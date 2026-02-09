"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function WorkspaceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (id) router.replace(`/settings/workspace/${id}/members`);
  }, [id, router]);

  return null;
}
