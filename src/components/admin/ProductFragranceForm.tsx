"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import Link from "next/link";
import TagInput from "@/components/admin/TagInput";
import AccordBuilder from "@/components/admin/AccordBuilder";
import type { Product } from "@/types/product";

export default function ProductFragranceForm({ product }: { product: Product }) {
  const router = useRouter();

  const [description, setDescription] = useState(product.description);
  const [topNotes, setTopNotes] = useState(product.topNotes);
  const [heartNotes, setHeartNotes] = useState(product.heartNotes);
  const [baseNotes, setBaseNotes] = useState(product.baseNotes);
  const [mainAccords, setMainAccords] = useState(product.mainAccords);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/products/${product.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, topNotes, heartNotes, baseNotes, mainAccords }),
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="glass-panel rounded-2xl p-7">
        <div className="mb-6 flex items-center gap-4">
          <span className="eyebrow text-[10px]">{product.brand}</span>
          <span className="text-mist/30">·</span>
          <h2 className="font-display text-xl text-paper">{product.name}</h2>
        </div>

        <label className="mb-2 block text-xs uppercase tracking-label text-mist/70">
          Description
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-none rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
        />
      </div>

      <div className="glass-panel flex flex-col gap-6 rounded-2xl p-7">
        <h3 className="font-display text-lg text-paper">Fragrance Pyramid</h3>
        <TagInput label="Top Notes" tags={topNotes} onChange={setTopNotes} />
        <TagInput label="Heart Notes" tags={heartNotes} onChange={setHeartNotes} />
        <TagInput label="Base Notes" tags={baseNotes} onChange={setBaseNotes} />
      </div>

      <div className="glass-panel rounded-2xl p-7">
        <AccordBuilder accords={mainAccords} onChange={setMainAccords} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {error && <p className="w-full text-xs text-red-400">{error}</p>}
        <button type="submit" disabled={saving} className="btn-gold">
          {saved ? (
            <>
              <Check size={16} /> Saved
            </>
          ) : saving ? (
            "Saving…"
          ) : (
            "Save Fragrance Profile"
          )}
        </button>
        <Link href={`/product/${product.slug}`} target="_blank" className="btn-ghost">
          View on Site
        </Link>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-sm text-mist/60 hover:text-gold"
        >
          Back to Products
        </button>
      </div>
    </form>
  );
}
