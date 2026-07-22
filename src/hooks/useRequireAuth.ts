"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const status = useAuthStore((s) => s.status);

  return function requireAuth(action: () => void) {
    if (status !== "authenticated") {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return false;
    }
    action();
    return true;
  };
}
