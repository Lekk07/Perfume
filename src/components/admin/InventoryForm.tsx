"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { Product } from "@/types/product";

export default function InventoryForm({
  product,
  isActive: initialIsActive,
}: {
  product: Product;
  isActive: boolean;
}) {
  const router = useRouter();

  const [variants, setVariants] = useState(
    product.variants.map((v) => ({ id: v.id, sizeMl: v.sizeMl, price: v.price, stock: v.stock }))
  );
  const [isActive, setIsActive] = useState(initialIsActive);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateVariant(id: string, field: "price" | "stock", value: number) {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/products/${product.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isActive,
        variants: variants.map((v) => ({ id: v.id, price: v.price, stock: v.stock })),
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Couldn't save changes.");
      return;
    }

    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel flex flex-col gap-6 rounded-2xl p-7">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-paper">Pricing &amp; Inventory</h3>
        <label className="flex items-center gap-2 text-sm text-mist/80">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          Published
        </label>
      </div>

      <div className="flex flex-col gap-3">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="grid grid-cols-1 items-center gap-3 rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 sm:grid-cols-[80px_1fr_1fr]"
          >
            <span className="text-sm text-paper">{variant.sizeMl}ml</span>
            <label className="flex items-center gap-2 text-xs text-mist/60">
              Price ₹
              <input
                type="number"
                min={0}
                value={variant.price}
                onChange={(e) => updateVariant(variant.id, "price", Number(e.target.value))}
                className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-1.5 text-sm text-paper focus:border-gold focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-mist/60">
              Stock
              <input
                type="number"
                min={0}
                value={variant.stock}
                onChange={(e) => updateVariant(variant.id, "stock", Number(e.target.value))}
                className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-1.5 text-sm text-paper focus:border-gold focus:outline-none"
              />
            </label>
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button type="submit" disabled={saving} className="btn-gold self-start">
        {saved ? (
          <>
            <Check size={16} /> Saved
          </>
        ) : saving ? (
          "Saving…"
        ) : (
          "Save Pricing & Inventory"
        )}
      </button>
    </form>
  );
}
