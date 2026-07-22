"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 pb-24 pt-40 text-center lg:px-10">
        <Heart size={40} strokeWidth={1} className="text-mist/40" />
        <h1 className="font-display text-3xl italic text-paper">Your wishlist is empty</h1>
        <p className="max-w-sm text-sm text-mist/60">
          Save fragrances you're curious about and come back to them anytime.
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
        <span className="eyebrow">saved for later</span>
        <h1 className="mt-3 text-4xl italic text-paper sm:text-5xl">Your Wishlist</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.productId} className="glass-panel flex items-center gap-4 rounded-2xl p-5">
            <Link href={`/product/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col gap-1">
              <span className="eyebrow text-[10px]">{item.brand}</span>
              <Link href={`/product/${item.slug}`}>
                <h3 className="font-display text-base text-paper hover:text-gold">{item.name}</h3>
              </Link>
              <p className="text-sm text-gold">from {formatPrice(item.fromPrice)}</p>
            </div>
            <button
              aria-label="Remove from wishlist"
              onClick={() => remove(item.productId)}
              className="rounded-full p-2 text-mist/50 hover:text-red-400"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
