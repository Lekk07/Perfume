"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export interface VariantDraft {
  sizeMl: number;
  price: number;
  stock: number;
}

export default function VariantBuilder({
  variants,
  onChange,
}: {
  variants: VariantDraft[];
  onChange: (variants: VariantDraft[]) => void;
}) {
  const [sizeMl, setSizeMl] = useState(5);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  function addVariant() {
    if (sizeMl <= 0 || price < 0 || stock < 0) return;
    if (variants.some((v) => v.sizeMl === sizeMl)) return;
    onChange([...variants, { sizeMl, price, stock }].sort((a, b) => a.sizeMl - b.sizeMl));
    setSizeMl(5);
    setPrice(0);
    setStock(0);
  }

  function removeVariant(index: number) {
    onChange(variants.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-label text-mist/70">
        Sizes, Pricing &amp; Stock
      </label>

      {variants.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {variants.map((v, i) => (
            <div
              key={v.sizeMl}
              className="flex items-center gap-4 rounded-xl border border-black/10 bg-black/[0.02] px-4 py-2.5"
            >
              <span className="w-14 text-sm text-paper">{v.sizeMl}ml</span>
              <span className="flex-1 text-sm text-mist/70">₹{v.price}</span>
              <span className="text-sm text-mist/70">{v.stock} in stock</span>
              <button
                type="button"
                onClick={() => removeVariant(i)}
                aria-label={`Remove ${v.sizeMl}ml`}
                className="text-mist/50 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-black/15 p-4">
        <label className="flex flex-col gap-1 text-xs text-mist/60">
          Size (ml)
          <input
            type="number"
            min={1}
            value={sizeMl}
            onChange={(e) => setSizeMl(Number(e.target.value))}
            className="w-20 rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-mist/60">
          Price ₹
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-24 rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-mist/60">
          Stock
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-20 rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-medium text-paper hover:bg-gold-light"
        >
          <Plus size={13} /> Add Size
        </button>
      </div>
    </div>
  );
}
