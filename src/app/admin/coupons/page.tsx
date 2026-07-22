"use client";

import { useState } from "react";
import { Plus, Power, Trash2 } from "lucide-react";
import { useCouponStore } from "@/store/couponStore";
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminCouponsPage() {
  const coupons = useCouponStore((s) => s.coupons);
  const addCoupon = useCouponStore((s) => s.addCoupon);
  const toggleActive = useCouponStore((s) => s.toggleActive);
  const removeCoupon = useCouponStore((s) => s.removeCoupon);

  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [percentOff, setPercentOff] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxUses, setMaxUses] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    addCoupon({
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      percentOff,
      minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
      maxUses: maxUses ? Number(maxUses) : undefined,
      isActive: true,
    });
    setCode("");
    setDescription("");
    setPercentOff(10);
    setMinOrderValue("");
    setMaxUses("");
    setShowForm(false);
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">promotions</span>
          <h1 className="mt-3 text-3xl italic text-paper">Coupons</h1>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-xs uppercase tracking-label text-paper hover:border-gold/50 hover:text-gold"
        >
          <Plus size={13} /> New Coupon
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass-panel mb-8 flex flex-col gap-4 rounded-2xl p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Coupon code (e.g. SUMMER20)"
              className="rounded-xl border border-black/15 bg-transparent px-4 py-2.5 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="rounded-xl border border-black/15 bg-transparent px-4 py-2.5 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs text-mist/60">
              % Off
              <input
                type="number"
                min={1}
                max={100}
                value={percentOff}
                onChange={(e) => setPercentOff(Number(e.target.value))}
                className="rounded-xl border border-black/15 bg-transparent px-4 py-2.5 text-sm text-paper focus:border-gold focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-mist/60">
              Min. Order Value (optional)
              <input
                type="number"
                min={0}
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="rounded-xl border border-black/15 bg-transparent px-4 py-2.5 text-sm text-paper focus:border-gold focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-mist/60">
              Max Uses (optional)
              <input
                type="number"
                min={1}
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="rounded-xl border border-black/15 bg-transparent px-4 py-2.5 text-sm text-paper focus:border-gold focus:outline-none"
              />
            </label>
          </div>
          <button type="submit" className="btn-gold self-start">
            Create Coupon
          </button>
        </form>
      )}

      <div className="glass-panel overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-xs uppercase tracking-label text-mist/50">
              <th className="px-6 py-4">Code</th>
              <th className="hidden px-6 py-4 sm:table-cell">Discount</th>
              <th className="hidden px-6 py-4 sm:table-cell">Used</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Manage</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-black/[0.06] last:border-0">
                <td className="px-6 py-4">
                  <p className="font-display text-base text-paper">{coupon.code}</p>
                  {coupon.description && (
                    <p className="text-xs text-mist/50">{coupon.description}</p>
                  )}
                </td>
                <td className="hidden px-6 py-4 text-mist/70 sm:table-cell">
                  {coupon.percentOff}%
                  {coupon.minOrderValue ? ` (min ₹${coupon.minOrderValue})` : ""}
                </td>
                <td className="hidden px-6 py-4 text-mist/70 sm:table-cell">
                  {coupon.usedCount}
                  {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-label",
                      coupon.isActive ? "border-gold/30 text-gold" : "border-black/15 text-mist/40"
                    )}
                  >
                    {coupon.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => toggleActive(coupon.id)}
                      className="flex items-center gap-1 text-xs text-mist/60 hover:text-gold"
                    >
                      <Power size={12} /> {coupon.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => removeCoupon(coupon.id)}
                      className="flex items-center gap-1 text-xs text-mist/60 hover:text-red-400"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
