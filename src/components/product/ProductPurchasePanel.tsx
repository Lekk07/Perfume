"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const description = product.description;

  const defaultVariant = product.variants.find((v) => v.sizeMl === 5) ?? product.variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant.id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? defaultVariant;

  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const inStock = selectedVariant.stock > 0;
  const lowStock = inStock && selectedVariant.stock <= 5;

  function handleAddToCart() {
    if (!inStock) return;
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (!inStock) return;
    addItem(product, selectedVariant, quantity);
    router.push("/cart");
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Size selector */}
      <div>
        <h4 className="mb-3 text-xs uppercase tracking-label text-mist/70">Size</h4>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => {
            const selected = variant.id === selectedVariant.id;
            const disabled = variant.stock === 0;
            return (
              <button
                key={variant.id}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedVariantId(variant.id)}
                className={cn(
                  "rounded-full border px-5 py-2 text-sm transition-all duration-300",
                  disabled
                    ? "cursor-not-allowed border-black/5 text-mist/30 line-through"
                    : selected
                    ? "border-gold bg-gold text-paper"
                    : "border-black/15 text-mist/80 hover:border-gold/50 hover:text-gold"
                )}
              >
                {variant.sizeMl}ml
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="h-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={selectedVariant.id}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl text-gold"
          >
            {formatPrice(selectedVariant.price)}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Stock status */}
      <p className={cn("text-sm", inStock ? (lowStock ? "text-gold" : "text-mist/70") : "text-red-400")}>
        {inStock
          ? lowStock
            ? `Only ${selectedVariant.stock} left in this size`
            : "In stock — ready to ship"
          : "Out of stock in this size"}
      </p>

      {/* Quantity */}
      <div>
        <h4 className="mb-3 text-xs uppercase tracking-label text-mist/70">Quantity</h4>
        <div className="inline-flex items-center gap-4 rounded-full border border-black/15 px-2 py-2">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="rounded-full p-1.5 text-paper hover:text-gold"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-sm text-paper">{quantity}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
            className="rounded-full p-1.5 text-paper hover:text-gold"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={cn("btn-gold", !inStock && "cursor-not-allowed opacity-40")}
        >
          {added ? (
            <>
              <Check size={16} /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag size={16} /> Add to Cart
            </>
          )}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!inStock}
          className={cn("btn-ghost", !inStock && "cursor-not-allowed opacity-40")}
        >
          Buy Now
        </button>
        <button
          onClick={() => toggleWishlist(product)}
          aria-pressed={isWishlisted}
          aria-label="Toggle wishlist"
          className={cn(
            "rounded-full border p-3 transition-colors",
            isWishlisted ? "border-gold text-gold" : "border-black/15 text-paper hover:border-gold/50 hover:text-gold"
          )}
        >
          <Heart size={18} className={isWishlisted ? "fill-gold" : ""} />
        </button>
      </div>

      {/* Description */}
      <div className="border-t border-black/10 pt-6">
        <h4 className="mb-3 text-xs uppercase tracking-label text-mist/70">Description</h4>
        <p className="text-sm leading-relaxed text-mist/80">{description}</p>
      </div>
    </div>
  );
}
