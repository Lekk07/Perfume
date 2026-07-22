"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function TagInput({
  label,
  tags,
  onChange,
  placeholder = "Type a note and press Enter",
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  function addTag() {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !value && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-label text-mist/70">{label}</label>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-black/15 bg-transparent px-3 py-2.5 focus-within:border-gold">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/[0.08] px-3 py-1 text-xs text-gold-light"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[140px] flex-1 bg-transparent py-1 text-sm text-paper placeholder:text-mist/40 focus:outline-none"
        />
      </div>
    </div>
  );
}
