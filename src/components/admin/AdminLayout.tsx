import Link from "next/link";
import { BarChart3, Building2, Package, ShoppingCart, Tag, Users } from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: BarChart3, active: true },
  { label: "Products", href: "/admin/products", icon: Package, active: true },
  { label: "Brands", href: "/admin/brands", icon: Building2, active: true },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart, active: true },
  { label: "Customers", href: "/admin/customers", icon: Users, active: true },
  { label: "Coupons", href: "/admin/coupons", icon: Tag, active: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-6 pb-24 pt-32 lg:px-10">
      <aside className="hidden w-56 shrink-0 flex-col gap-2 lg:flex">
        <span className="eyebrow mb-4 px-3">admin</span>
        {NAV.map(({ label, href, icon: Icon, active }) => (
          <Link
            key={href}
            href={active ? href : "#"}
            className={
              active
                ? "flex items-center gap-3 rounded-xl bg-black/[0.04] px-3 py-2.5 text-sm text-gold"
                : "flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-mist/35"
            }
          >
            <Icon size={16} strokeWidth={1.5} />
            {label}
            {!active && (
              <span className="ml-auto rounded-full border border-black/10 px-2 py-0.5 text-[9px] uppercase tracking-label text-mist/40">
                Soon
              </span>
            )}
          </Link>
        ))}
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
