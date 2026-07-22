"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

// Server-side middleware.ts already redirects unauthenticated requests to
// /login before this ever renders. This guard is a client-side backstop for
// the case where the session cookie expires or is cleared mid-session
// (middleware only runs on navigation, not on client-side state changes).
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    if (status === "idle") hydrate();
  }, [status, hydrate]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "idle" || status === "loading") {
    return <div className="min-h-[60vh]" />;
  }

  if (status === "unauthenticated") {
    return <div className="min-h-[60vh]" />;
  }

  return <>{children}</>;
}
