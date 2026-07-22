"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export default function OrderHistoryList() {
  const user = useAuthStore((s) => s.currentUser());
  const allOrders = useOrderStore((s) => s.orders);
  const orders = useMemo(
    () => (user ? allOrders.filter((o) => o.userId === user.id) : []),
    [allOrders, user]
  );

  if (orders.length === 0) {
    return (
      <div className="glass-panel flex flex-col items-center gap-4 rounded-2xl p-12 text-center">
        <Package size={32} strokeWidth={1} className="text-mist/40" />
        <p className="font-display text-lg text-paper">No orders yet</p>
        <p className="max-w-sm text-sm text-mist/60">
          Once you place your first order, you'll be able to track it here.
        </p>
        <Link href="/shop" className="btn-gold">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {orders.map((order) => (
        <div key={order.id} className="glass-panel flex flex-col gap-4 rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-4">
            <div>
              <p className="font-display text-lg text-paper">{order.orderNumber}</p>
              <p className="text-xs text-mist/50">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className="rounded-full border border-gold/30 px-3 py-1 text-[10px] uppercase tracking-label text-gold">
              {STATUS_LABEL[order.status] ?? order.status}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={`${item.productSlug}-${item.sizeMl}`} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-paper">{item.name}</p>
                  <p className="text-xs text-mist/50">
                    {item.sizeMl}ml × {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-mist/70">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-black/10 pt-4">
            <span className="text-xs text-mist/50">
              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online"}
            </span>
            <span className="font-display text-base text-gold">{formatPrice(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
