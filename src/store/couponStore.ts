"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  percentOff: number;
  minOrderValue?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

interface CouponState {
  coupons: Coupon[];
  addCoupon: (data: Omit<Coupon, "id" | "usedCount" | "createdAt">) => void;
  updateCoupon: (id: string, data: Omit<Coupon, "id" | "usedCount" | "createdAt">) => void;
  toggleActive: (id: string) => void;
  removeCoupon: (id: string) => void;
  validate: (code: string, subtotal: number) => { valid: boolean; percentOff?: number; message: string };
  recordUse: (code: string) => void;
}

const SEED_COUPONS: Coupon[] = [
  {
    id: "c_welcome10",
    code: "WELCOME10",
    description: "10% off for new customers",
    percentOff: 10,
    usedCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "c_decant15",
    code: "DECANT15",
    description: "15% off orders over ₹1000",
    percentOff: 15,
    minOrderValue: 1000,
    usedCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Coupons managed from the Admin Dashboard. This becomes a real Coupon
// Prisma model + /api/admin/coupons routes once the backend module lands;
// cartStore.applyCoupon already calls validate()/recordUse() here, so that
// swap won't require touching the cart flow.
export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: SEED_COUPONS,

      addCoupon: (data) => {
        const id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        set((state) => ({
          coupons: [...state.coupons, { ...data, id, usedCount: 0, createdAt: new Date().toISOString() }],
        }));
      },

      updateCoupon: (id, data) => {
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },

      toggleActive: (id) => {
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
        }));
      },

      removeCoupon: (id) => {
        set((state) => ({ coupons: state.coupons.filter((c) => c.id !== id) }));
      },

      validate: (code, subtotal) => {
        const coupon = get().coupons.find((c) => c.code === code.trim().toUpperCase());
        if (!coupon) return { valid: false, message: "That coupon code isn't valid." };
        if (!coupon.isActive) return { valid: false, message: "This coupon is no longer active." };
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
          return { valid: false, message: "This coupon has expired." };
        }
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          return { valid: false, message: "This coupon has reached its usage limit." };
        }
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
          return {
            valid: false,
            message: `This coupon requires a minimum order of ₹${coupon.minOrderValue}.`,
          };
        }
        return { valid: true, percentOff: coupon.percentOff, message: `${coupon.percentOff}% off applied.` };
      },

      recordUse: (code) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code === code.trim().toUpperCase() ? { ...c, usedCount: c.usedCount + 1 } : c
          ),
        }));
      },
    }),
    { name: "lumiere-coupons" }
  )
);
