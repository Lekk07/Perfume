"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import TagInput from "@/components/admin/TagInput";
import AccordBuilder from "@/components/admin/AccordBuilder";
import ImageManager from "@/components/admin/ImageManager";
import VariantBuilder, { type VariantDraft } from "@/components/admin/VariantBuilder";
import type { Accord, PerfumeCategory } from "@/types/product";

const CATEGORIES: PerfumeCategory[] = ["DESIGNER", "NICHE", "MENS", "WOMENS", "UNISEX"];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductCreateForm() {
  const router = useRouter();

  const [brands, setBrands] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [brandId, setBrandId] = useState("");
  const [category, setCategory] = useState<PerfumeCategory>("UNISEX");
  const [concentration, setConcentration] = useState("Eau de Parfum");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantDraft[]>([]);
  const [topNotes, setTopNotes] = useState<string[]>([]);
  const [heartNotes, setHeartNotes] = useState<string[]>([]);
  const [baseNotes, setBaseNotes] = useState<string[]>([]);
  const [mainAccords, setMainAccords] = useState<Accord[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => (res.ok ? res.json() : { brands: [] }))
      .then((data) => {
        setBrands(data.brands ?? []);
        if (data.brands?.[0]) setBrandId(data.brands[0].id);
      })
      .catch(() => setBrands([]));
  }, []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  function validate(): string | null {
    if (!name.trim()) return "Enter a perfume name.";
    if (!slug.trim()) return "Enter a URL slug.";
    if (!brandId) return "Select a brand.";
    if (!description.trim()) return "Enter a description.";
    if (images.length === 0) return "Add at least one product image.";
    if (variants.length === 0) return "Add at least one size with price and stock.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSaving(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        slug: slug.trim(),
        brandId,
        category,
        description: description.trim(),
        topNotes,
        heartNotes,
        baseNotes,
        mainAccords,
        concentration,
        images,
        variants,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Couldn't create the product.");
      return;
    }

    router.push(`/admin/products/${data.product.id}/edit`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="glass-panel flex flex-col gap-5 rounded-2xl p-7">
        <h3 className="font-display text-lg text-paper">Identity</h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-label text-mist/70">
              Perfume Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ombre Nomade"
              className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-label text-mist/70">
              URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              placeholder="ombre-nomade"
              className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs uppercase tracking-label text-mist/70">Brand</label>
              <Link href="/admin/brands" className="text-[11px] text-gold hover:underline">
                Manage brands
              </Link>
            </div>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper focus:border-gold focus:outline-none"
            >
              {brands.length === 0 && <option value="">Loading brands…</option>}
              {brands.map((b) => (
                <option key={b.id} value={b.id} className="bg-ink text-paper">
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-label text-mist/70">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PerfumeCategory)}
              className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper focus:border-gold focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-ink text-paper">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-label text-mist/70">
              Concentration
            </label>
            <input
              type="text"
              value={concentration}
              onChange={(e) => setConcentration(e.target.value)}
              placeholder="Eau de Parfum"
              className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
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

        <ImageManager images={images} onChange={setImages} />
      </div>

      <div className="glass-panel rounded-2xl p-7">
        <VariantBuilder variants={variants} onChange={setVariants} />
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
        {error && <p className="w-full text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={saving} className="btn-gold">
          {saving ? (
            "Creating…"
          ) : (
            <>
              <Check size={16} /> Create Perfume
            </>
          )}
        </button>
      </div>
    </form>
  );
}
