"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const NAV = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Order History", href: "/orders", icon: Package },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.currentUser());

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-24 pt-32 lg:flex-row lg:px-10">
      <aside className="w-full shrink-0 lg:w-56">
        <div className="mb-6">
          <span className="eyebrow">account</span>
          <p className="mt-2 font-display text-lg text-paper">{user?.name}</p>
          <p className="text-xs text-mist/50">{user?.email}</p>
        </div>
        <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-black/[0.04] text-gold" : "text-mist/70 hover:text-paper"
                )}
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-mist/70 hover:text-red-400"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Logout
          </button>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
