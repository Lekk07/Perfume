"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { CartLine } from "@/store/cartStore";
import { useCartStore } from "@/store/cartStore";

export default function CartItemRow({ line }: { line: CartLine }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="glass-panel flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center"
    >
      <Link href={`/product/${line.productSlug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
        <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <span className="eyebrow text-[10px]">{line.brand}</span>
        <Link href={`/product/${line.productSlug}`}>
          <h3 className="font-display text-lg text-paper hover:text-gold">{line.name}</h3>
        </Link>
        <p className="text-xs text-mist/60">{line.sizeMl}ml</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="inline-flex items-center gap-3 rounded-full border border-black/15 px-2 py-1.5">
          <button
            aria-label="Decrease quantity"
            onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
            className="rounded-full p-1 text-paper hover:text-gold"
          >
            <Minus size={13} />
          </button>
          <span className="w-5 text-center text-sm text-paper">{line.quantity}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
            className="rounded-full p-1 text-paper hover:text-gold"
          >
            <Plus size={13} />
          </button>
        </div>

        <p className="w-20 text-right text-sm font-medium text-gold">
          {formatPrice(line.price * line.quantity)}
        </p>

        <button
          aria-label="Remove item"
          onClick={() => removeItem(line.variantId)}
          className="rounded-full p-2 text-mist/50 hover:text-red-400"
        >
          <Trash2 size={16} strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  );
}
