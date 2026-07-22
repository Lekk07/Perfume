"use client";

import { useState } from "react";
import { Loader2, Plus, Upload, X } from "lucide-react";

export default function ImageManager({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addUrl() {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onChange([...images, trimmed]);
      setUrlInput("");
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));

    setUploading(false);
    e.target.value = "";

    if (!res.ok) {
      setError(data.error ?? "Upload failed.");
      return;
    }
    onChange([...images, data.url]);
  }

  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-label text-mist/70">
        Product Images
      </label>

      {images.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={img + i} className="relative h-20 w-20 overflow-hidden rounded-xl border border-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`Product image ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label="Remove image"
                className="absolute right-1 top-1 rounded-full bg-ink/80 p-1 text-paper"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-xs text-paper hover:border-gold/50 hover:text-gold">
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? "Uploading…" : "Upload Image"}
          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={uploading} />
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste an image URL"
            className="rounded-full border border-black/15 bg-transparent px-4 py-2 text-xs text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
          />
          <button
            type="button"
            onClick={addUrl}
            className="flex items-center gap-1 rounded-full border border-black/15 px-3 py-2 text-xs text-paper hover:border-gold/50 hover:text-gold"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      <p className="mt-2 text-xs text-mist/50">
        Prefer "Upload Image" when possible — pasted URLs from domains other than
        Cloudinary or Unsplash won't display on the live product page until added to
        the allowed image domains in <code className="text-gold/70">next.config.ts</code>.
      </p>
    </div>
  );
}
