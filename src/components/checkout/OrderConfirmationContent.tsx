"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useOrderStore } from "@/store/orderStore";

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const order = useOrderStore((s) => (orderNumber ? s.getOrderByNumber(orderNumber) : undefined));

  if (!order) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 pb-24 pt-40 text-center">
        <p className="font-display text-2xl italic text-paper">Order not found</p>
        <p className="text-sm text-mist/60">
          We couldn't find that order. If you just placed it, check your Order History instead.
        </p>
        <Link href="/orders" className="btn-gold">
          View Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-32 lg:px-10">
      <div className="mb-10 flex flex-col items-center text-center">
        <CheckCircle2 size={44} strokeWidth={1.2} className="text-gold" />
        <span className="eyebrow mt-6">order confirmed</span>
        <h1 className="mt-3 text-4xl italic text-paper sm:text-5xl">Thank You</h1>
        <p className="mt-4 text-sm text-mist/70">
          Your order <span className="text-gold">{order.orderNumber}</span> has been placed.
          {order.paymentMethod === "COD"
            ? " Pay in cash when it arrives."
            : " Your payment was successful."}
        </p>
      </div>

      <div className="glass-panel flex flex-col gap-4 rounded-2xl p-6">
        {order.items.map((item) => (
          <div key={`${item.productSlug}-${item.sizeMl}`} className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-display text-base text-paper">{item.name}</p>
              <p className="text-xs text-mist/60">
                {item.sizeMl}ml × {item.quantity}
              </p>
            </div>
            <p className="text-sm text-gold">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}

        <div className="flex flex-col gap-2 border-t border-black/10 pt-4 text-sm">
          <div className="flex justify-between text-mist/70">
            <span>Subtotal</span>
            <span className="text-paper">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-gold">
              <span>Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-mist/70">
            <span>Shipping</span>
            <span className="text-paper">{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-black/10 pt-2 font-display text-base text-paper">
            <span>Total</span>
            <span className="text-gold">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="border-t border-black/10 pt-4 text-sm text-mist/70">
          <p className="text-paper">{order.address.fullName}</p>
          <p>
            {order.address.line1}
            {order.address.line2 ? `, ${order.address.line2}` : ""}
          </p>
          <p>
            {order.address.city}, {order.address.state} {order.address.postalCode}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/orders" className="btn-gold">
          View Order History
        </Link>
        <Link href="/shop" className="btn-ghost">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
