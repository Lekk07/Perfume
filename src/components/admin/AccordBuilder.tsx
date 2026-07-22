"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Accord } from "@/types/product";

export default function AccordBuilder({
  accords,
  onChange,
}: {
  accords: Accord[];
  onChange: (accords: Accord[]) => void;
}) {
  const [name, setName] = useState("");
  const [intensity, setIntensity] = useState(70);

  function addAccord() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onChange([...accords, { name: trimmed, intensity }]);
    setName("");
    setIntensity(70);
  }

  function removeAccord(index: number) {
    onChange(accords.filter((_, i) => i !== index));
  }

  function updateIntensity(index: number, value: number) {
    onChange(accords.map((a, i) => (i === index ? { ...a, intensity: value } : a)));
  }

  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-label text-mist/70">
        Main Accords
      </label>

      <div className="flex flex-col gap-3">
        {accords.map((accord, i) => (
          <div
            key={`${accord.name}-${i}`}
            className="flex items-center gap-4 rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3"
          >
            <span className="w-28 shrink-0 text-sm text-paper">{accord.name}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={accord.intensity}
              onChange={(e) => updateIntensity(i, Number(e.target.value))}
              className="flex-1 accent-gold"
            />
            <span className="w-10 shrink-0 text-right text-xs text-gold">{accord.intensity}%</span>
            <button
              type="button"
              onClick={() => removeAccord(i)}
              aria-label={`Remove ${accord.name}`}
              className="text-mist/50 hover:text-red-400"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-black/15 p-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Accord name (e.g. Woody)"
          className="min-w-[160px] flex-1 rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
        />
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-28 accent-gold"
          />
          <span className="w-10 text-xs text-gold">{intensity}%</span>
        </div>
        <button
          type="button"
          onClick={addAccord}
          className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-medium text-paper transition-colors hover:bg-gold-light"
        >
          <Plus size={13} /> Add Accord
        </button>
      </div>
    </div>
  );
}
