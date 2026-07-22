"use client";

import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 pb-24 pt-40 text-center lg:px-10">
        <ShoppingBag size={40} strokeWidth={1} className="text-mist/40" />
        <h1 className="font-display text-3xl italic text-paper">Your cart is empty</h1>
        <p className="max-w-sm text-sm text-mist/60">
          Find your next signature scent — 300+ perfumes available in considered decant sizes.
        </p>
        <Link href="/shop" className="btn-gold">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <div className="mb-10 text-center">
        <span className="eyebrow">your selection</span>
        <h1 className="mt-3 text-4xl italic text-paper sm:text-5xl">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {lines.map((line) => (
              <CartItemRow key={line.variantId} line={line} />
            ))}
          </AnimatePresence>
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
