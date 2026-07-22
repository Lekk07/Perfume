"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Tag, X } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

const SHIPPING_FEE = 79;
const FREE_SHIPPING_THRESHOLD = 1500;

export default function CartSummary({ showCheckoutButton = true }: { showCheckoutButton?: boolean }) {
  const subtotal = useCartStore((s) => s.subtotal());
  const discountPercent = useCartStore((s) => s.discountPercent);
  const couponCode = useCartStore((s) => s.couponCode);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const [couponInput, setCouponInput] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const discount = (subtotal * discountPercent) / 100;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    setMessage({ type: result.success ? "success" : "error", text: result.message });
    if (result.success) setCouponInput("");
  }

  return (
    <div className="glass-panel flex flex-col gap-6 rounded-2xl p-7">
      <h3 className="font-display text-xl text-paper">Order Summary</h3>

      {/* Coupon */}
      {couponCode ? (
        <div className="flex items-center justify-between rounded-full border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm text-gold">
          <span className="flex items-center gap-2">
            <Check size={14} /> {couponCode} applied
          </span>
          <button onClick={removeCoupon} aria-label="Remove coupon">
            <X size={14} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <div className="relative flex-1">
            <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-mist/40" />
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code"
              className="w-full rounded-full border border-black/15 bg-transparent py-2.5 pl-10 pr-4 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
            />
          </div>
          <button type="submit" className="btn-ghost !px-5 !py-2.5 text-xs">
            Apply
          </button>
        </form>
      )}
      {message && (
        <p className={cn("-mt-3 text-xs", message.type === "success" ? "text-gold" : "text-red-400")}>
          {message.text}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-black/10 pt-5 text-sm">
        <div className="flex justify-between text-mist/70">
          <span>Subtotal</span>
          <span className="text-paper">{formatPrice(subtotal)}</span>
        </div>
        {discountPercent > 0 && (
          <div className="flex justify-between text-gold">
            <span>Discount ({discountPercent}%)</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-mist/70">
          <span>Shipping</span>
          <span className="text-paper">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-mist/50">
            Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </p>
        )}
      </div>

      <div className="flex justify-between border-t border-black/10 pt-5">
        <span className="font-display text-lg text-paper">Total</span>
        <span className="font-display text-lg text-gold">{formatPrice(total)}</span>
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className={cn("btn-gold w-full", subtotal === 0 && "pointer-events-none opacity-40")}
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
