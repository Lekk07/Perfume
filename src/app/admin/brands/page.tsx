"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  _count: { products: number };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function BrandForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Brand;
  onSave: (data: { name: string; slug: string; description?: string }) => Promise<string | null>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setSaving(true);
    setError(null);
    const failure = await onSave({ name: name.trim(), slug: slug.trim(), description: description.trim() || undefined });
    setSaving(false);
    if (failure) setError(failure);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel mb-8 flex flex-col gap-4 rounded-2xl p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Brand name (e.g. Xerjoff)"
          className="rounded-xl border border-black/15 bg-transparent px-4 py-2.5 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
        />
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
          placeholder="xerjoff"
          className="rounded-xl border border-black/15 bg-transparent px-4 py-2.5 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
        />
      </div>
      <textarea
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description (optional)"
        className="resize-none rounded-xl border border-black/15 bg-transparent px-4 py-2.5 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-gold">
          {saving ? "Saving…" : initial ? "Save Changes" : "Create Brand"}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "add" | { edit: string }>("list");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function loadBrands() {
    fetch("/api/brands")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Failed to load brands");
        return res.json();
      })
      .then((data) => setBrands(data.brands))
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadBrands();
  }, []);

  async function createBrand(data: { name: string; slug: string; description?: string }) {
    const res = await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) return result.error ?? "Couldn't create brand.";
    setMode("list");
    loadBrands();
    return null;
  }

  async function updateBrand(id: string, data: { name: string; slug: string; description?: string }) {
    const res = await fetch(`/api/brands/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) return result.error ?? "Couldn't save changes.";
    setMode("list");
    loadBrands();
    return null;
  }

  async function deleteBrand(id: string) {
    setDeleteError(null);
    const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setDeleteError(data.error ?? "Couldn't delete brand.");
      return;
    }
    loadBrands();
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">the houses</span>
          <h1 className="mt-3 text-3xl italic text-paper">Brands</h1>
        </div>
        {mode === "list" && (
          <button
            onClick={() => setMode("add")}
            className="flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-xs font-medium uppercase tracking-label text-paper hover:bg-gold-light"
          >
            <Plus size={13} /> New Brand
          </button>
        )}
      </div>

      {mode === "add" && (
        <BrandForm onSave={createBrand} onCancel={() => setMode("list")} />
      )}

      {typeof mode === "object" && brands && (
        <BrandForm
          initial={brands.find((b) => b.id === mode.edit)}
          onSave={(data) => updateBrand(mode.edit, data)}
          onCancel={() => setMode("list")}
        />
      )}

      {deleteError && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-3 text-sm text-red-500">
          {deleteError}
          <button onClick={() => setDeleteError(null)} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      )}

      {error && <div className="glass-panel rounded-2xl p-8 text-center text-sm text-red-500">{error}</div>}

      {!error && brands === null && (
        <div className="glass-panel rounded-2xl p-8 text-center text-sm text-mist/60">Loading…</div>
      )}

      {!error && brands && (
        <div className="glass-panel overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-xs uppercase tracking-label text-mist/50">
                <th className="px-6 py-4">Brand</th>
                <th className="hidden px-6 py-4 sm:table-cell">Slug</th>
                <th className="px-6 py-4 text-right">Products</th>
                <th className="px-6 py-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-display text-base text-paper">{brand.name}</p>
                    {brand.description && (
                      <p className="text-xs text-mist/50">{brand.description}</p>
                    )}
                  </td>
                  <td className="hidden px-6 py-4 text-mist/70 sm:table-cell">/{brand.slug}</td>
                  <td className="px-6 py-4 text-right text-gold">{brand._count.products}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setMode({ edit: brand.id })}
                        className="flex items-center gap-1 text-xs text-mist/60 hover:text-gold"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => deleteBrand(brand.id)}
                        className="flex items-center gap-1 text-xs text-mist/60 hover:text-red-500"
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
      )}
    </AdminLayout>
  );
}
