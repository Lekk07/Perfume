"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function ProductCard({ product }: { product: Product }) {
  const defaultVariant =
    product.variants.find((v) => v.sizeMl === 5) ?? product.variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant.id);
  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? defaultVariant;

  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  function handleAddToCart() {
    addItem(product, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-raised">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(min-width: 1024px) 25vw, 45vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Hover actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            aria-label="Add to wishlist"
            aria-pressed={isWishlisted}
            onClick={() => toggleWishlist(product)}
            className={cn(
              "rounded-full bg-ink/70 p-2.5 backdrop-blur-glass transition-colors",
              isWishlisted ? "text-gold" : "text-paper hover:text-gold"
            )}
          >
            <Heart size={16} strokeWidth={1.5} className={isWishlisted ? "fill-gold" : ""} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            aria-label="Quick view"
            className="rounded-full bg-ink/70 p-2.5 text-paper backdrop-blur-glass transition-colors hover:text-gold"
          >
            <Eye size={16} strokeWidth={1.5} />
          </Link>
        </div>

        <button
          onClick={handleAddToCart}
          className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-paper/95 py-2.5 text-xs font-medium uppercase tracking-label text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {added ? (
            <>
              <Check size={14} strokeWidth={2} /> Added
            </>
          ) : (
            <>
              <ShoppingBag size={14} strokeWidth={1.5} /> Add to Cart
            </>
          )}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <span className="eyebrow text-[10px]">{product.brand}</span>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-lg text-paper transition-colors group-hover:text-gold">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-mist/70">
          <Star size={12} className="fill-gold text-gold" />
          {product.rating} <span className="text-mist/40">({product.reviewCount})</span>
        </div>

        {/* Size selector */}
        <div
          className="mt-2 flex flex-wrap items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {product.variants.map((variant) => {
            const isSelected = variant.id === selectedVariant.id;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                aria-pressed={isSelected}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-all duration-300",
                  isSelected
                    ? "border-gold bg-gold text-paper"
                    : "border-black/15 text-mist/70 hover:border-gold/50 hover:text-gold"
                )}
              >
                {variant.sizeMl}ml
              </button>
            );
          })}
        </div>

        {/* Price, animated on size change */}
        <div className="mt-2 h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={selectedVariant.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="font-medium text-gold"
            >
              {formatPrice(selectedVariant.price)}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
