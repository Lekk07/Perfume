"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useOrderStore } from "@/store/orderStore";
import type { OrderStatus } from "@/types/order";
import AdminLayout from "@/components/admin/AdminLayout";

const STATUSES: OrderStatus[] = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function AdminOrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">fulfillment</span>
          <h1 className="mt-3 text-3xl italic text-paper">Orders</h1>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as OrderStatus | "ALL")}
          className="rounded-full border border-black/15 bg-transparent px-4 py-2 text-xs uppercase tracking-label text-paper focus:border-gold focus:outline-none"
        >
          <option value="ALL" className="bg-ink-raised">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-ink-raised">
              {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel flex flex-col items-center gap-3 rounded-2xl p-12 text-center">
          <p className="text-sm text-mist/60">No orders {filter !== "ALL" ? "with this status" : "yet"}.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => (
            <div key={order.id} className="glass-panel flex flex-col gap-4 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
                <div>
                  <p className="font-display text-lg text-paper">{order.orderNumber}</p>
                  <p className="text-xs text-mist/50">
                    {order.email} · {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                  className="rounded-full border border-gold/30 bg-transparent px-3 py-1.5 text-xs uppercase tracking-label text-gold focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-ink-raised text-paper">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-3">
                {order.items.map((item) => (
                  <div key={`${item.productSlug}-${item.sizeMl}`} className="flex items-center gap-2">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                      <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <span className="text-xs text-mist/60">
                      {item.name} ({item.sizeMl}ml × {item.quantity})
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-black/10 pt-4 text-sm">
                <span className="text-mist/50">
                  {order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online"} ·{" "}
                  {order.address.city}, {order.address.state}
                </span>
                <span className="font-display text-base text-gold">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
