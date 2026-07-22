"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  fromPrice: number;
}

interface WishlistState {
  items: WishlistItem[];
  has: (productId: string) => boolean;
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      has: (productId) => get().items.some((i) => i.productId === productId),

      toggle: (product) => {
        const exists = get().items.some((i) => i.productId === product.id);
        if (exists) {
          set((state) => ({
            items: state.items.filter((i) => i.productId !== product.id),
          }));
        } else {
          set((state) => ({
            items: [
              ...state.items,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                image: product.images[0],
                fromPrice: Math.min(...product.variants.map((v) => v.price)),
              },
            ],
          }));
        }
      },

      remove: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
      },
    }),
    { name: "lumiere-wishlist" }
  )
);
