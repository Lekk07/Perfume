"use client";

import Link from "next/link";
import { Building2, Package, ShoppingCart, Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useOrderStore } from "@/store/orderStore";
import { useEffect, useState } from "react";
import { useCouponStore } from "@/store/couponStore";
import { getAllProducts } from "@/lib/mock-data";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminDashboardPage() {
  const orders = useOrderStore((s) => s.orders);
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [brandCount, setBrandCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => (res.ok ? res.json() : { users: [] }))
      .then((data) => setCustomerCount(data.users?.length ?? 0))
      .catch(() => setCustomerCount(0));

    fetch("/api/brands")
      .then((res) => (res.ok ? res.json() : { brands: [] }))
      .then((data) => setBrandCount(data.brands?.length ?? 0))
      .catch(() => setBrandCount(0));
  }, []);
  const coupons = useCouponStore((s) => s.coupons);
  const products = getAllProducts();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const activeCoupons = coupons.filter((c) => c.isActive).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout>
      <div className="mb-10">
        <span className="eyebrow">overview</span>
        <h1 className="mt-3 text-3xl italic text-paper">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <div className="glass-panel rounded-2xl p-6">
          <p className="text-xs uppercase tracking-label text-mist/60">Revenue</p>
          <p className="mt-2 font-display text-2xl text-gold">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <p className="text-xs uppercase tracking-label text-mist/60">Orders</p>
          <p className="mt-2 font-display text-2xl text-gold">{orders.length}</p>
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <p className="text-xs uppercase tracking-label text-mist/60">Avg. Order Value</p>
          <p className="mt-2 font-display text-2xl text-gold">{formatPrice(avgOrderValue)}</p>
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <p className="text-xs uppercase tracking-label text-mist/60">Customers</p>
          <p className="mt-2 font-display text-2xl text-gold">{customerCount ?? "…"}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/products"
          className="glass-panel flex items-center gap-4 rounded-2xl p-6 transition-colors hover:border-gold/40"
        >
          <div className="rounded-full border border-gold/30 p-3 text-gold">
            <Package size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-display text-lg text-paper">{products.length} Perfumes</p>
            <p className="text-sm text-mist/60">Manage catalog</p>
          </div>
        </Link>
        <Link
          href="/admin/brands"
          className="glass-panel flex items-center gap-4 rounded-2xl p-6 transition-colors hover:border-gold/40"
        >
          <div className="rounded-full border border-gold/30 p-3 text-gold">
            <Building2 size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-display text-lg text-paper">{brandCount ?? "…"} Brands</p>
            <p className="text-sm text-mist/60">Manage the houses</p>
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="glass-panel flex items-center gap-4 rounded-2xl p-6 transition-colors hover:border-gold/40"
        >
          <div className="rounded-full border border-gold/30 p-3 text-gold">
            <ShoppingCart size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-display text-lg text-paper">{orders.length} Orders</p>
            <p className="text-sm text-mist/60">Track fulfillment</p>
          </div>
        </Link>
        <Link
          href="/admin/coupons"
          className="glass-panel flex items-center gap-4 rounded-2xl p-6 transition-colors hover:border-gold/40"
        >
          <div className="rounded-full border border-gold/30 p-3 text-gold">
            <Tag size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-display text-lg text-paper">{activeCoupons} Active Coupons</p>
            <p className="text-sm text-mist/60">Manage promotions</p>
          </div>
        </Link>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-paper">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-mist/60 hover:text-gold">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-sm text-mist/60">
            No orders placed yet.
          </div>
        ) : (
          <div className="glass-panel overflow-hidden rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 text-xs uppercase tracking-label text-mist/50">
                  <th className="px-6 py-4">Order</th>
                  <th className="hidden px-6 py-4 sm:table-cell">Customer</th>
                  <th className="hidden px-6 py-4 sm:table-cell">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-black/[0.06] last:border-0">
                    <td className="px-6 py-4 text-paper">{order.orderNumber}</td>
                    <td className="hidden px-6 py-4 text-mist/70 sm:table-cell">{order.email}</td>
                    <td className="hidden px-6 py-4 text-mist/70 sm:table-cell">{order.status}</td>
                    <td className="px-6 py-4 text-right text-gold">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
