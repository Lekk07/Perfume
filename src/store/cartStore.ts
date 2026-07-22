"use client";

import { create } from "zustand";
import type { Product, ProductVariant } from "@/types/product";
import { useCouponStore } from "@/store/couponStore";

export interface CartLine {
  productId: string;
  productSlug: string;
  name: string;
  brand: string;
  image: string;
  variantId: string;
  sizeMl: number;
  price: number;
  quantity: number;
}

type Status = "idle" | "loading" | "ready";

interface CartState {
  lines: CartLine[];
  status: Status;
  couponCode: string | null;
  discountPercent: number;

  hydrate: () => Promise<void>;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clear: () => Promise<void>;
  itemCount: () => number;
  subtotal: () => number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapServerCart(cart: any): CartLine[] {
  if (!cart?.items) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return cart.items.map((item: any) => ({
    productId: item.productId,
    productSlug: item.product.slug,
    name: item.product.name,
    brand: item.product.brand?.name ?? "",
    image: item.product.images?.[0] ?? "",
    variantId: item.variantId,
    sizeMl: item.variant.sizeMl,
    price: Number(item.variant.price),
    quantity: item.quantity,
  }));
}

async function fetchCart(): Promise<CartLine[]> {
  const res = await fetch("/api/cart", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return mapServerCart(data.cart);
}

export const useCartStore = create<CartState>()((set, get) => ({
  lines: [],
  status: "idle",
  couponCode: null,
  discountPercent: 0,

  hydrate: async () => {
    set({ status: "loading" });
    const lines = await fetchCart();
    set({ lines, status: "ready" });
  },

  addItem: async (product, variant, quantity = 1) => {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: variant.id, quantity }),
    });
    const lines = await fetchCart();
    set({ lines });
  },

  removeItem: async (variantId) => {
    await fetch(`/api/cart/${variantId}`, { method: "DELETE" });
    const lines = await fetchCart();
    set({ lines });
  },

  updateQuantity: async (variantId, quantity) => {
    await fetch(`/api/cart/${variantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    const lines = await fetchCart();
    set({ lines });
  },

  applyCoupon: (code) => {
    const normalized = code.trim().toUpperCase();
    const subtotal = get().subtotal();
    const result = useCouponStore.getState().validate(normalized, subtotal);
    if (!result.valid || !result.percentOff) {
      return { success: false, message: result.message };
    }
    useCouponStore.getState().recordUse(normalized);
    set({ couponCode: normalized, discountPercent: result.percentOff });
    return { success: true, message: result.message };
  },

  removeCoupon: () => set({ couponCode: null, discountPercent: 0 }),

  clear: async () => {
    await fetch("/api/cart", { method: "DELETE" });
    set({ lines: [], couponCode: null, discountPercent: 0 });
  },

  itemCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),

  subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
}));
