"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ShopFilters {
  brands: string[];
  maxPrice: number;
  inStockOnly: boolean;
}

const PRICE_CEILING = 2500;

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  className,
}: {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
  onReset: () => void;
  className?: string;
}) {
  const [brandOptions, setBrandOptions] = useState<{ name: string; slug: string }[]>([]);

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => (res.ok ? res.json() : { brands: [] }))
      .then((data) => setBrandOptions(data.brands ?? []))
      .catch(() => setBrandOptions([]));
  }, []);

  function toggleBrand(slug: string) {
    const brands = filters.brands.includes(slug)
      ? filters.brands.filter((b) => b !== slug)
      : [...filters.brands, slug];
    onChange({ ...filters, brands });
  }

  const hasActiveFilters =
    filters.brands.length > 0 || filters.maxPrice < PRICE_CEILING || filters.inStockOnly;

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex items-center justify-between">
        <span className="eyebrow">filters</span>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-mist/60 hover:text-gold"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Brand */}
      <div>
        <h4 className="mb-4 font-display text-lg text-paper">Brand</h4>
        <div className="flex flex-col gap-3">
          {brandOptions.map((brand) => (
            <label
              key={brand.slug}
              className="flex cursor-pointer items-center gap-3 text-sm text-mist/80 hover:text-paper"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand.slug)}
                onChange={() => toggleBrand(brand.slug)}
                className="h-4 w-4 rounded border-black/20 bg-transparent accent-gold"
              />
              {brand.name}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="mb-4 font-display text-lg text-paper">Price</h4>
        <input
          type="range"
          min={200}
          max={PRICE_CEILING}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-gold"
        />
        <div className="mt-2 flex justify-between text-xs text-mist/60">
          <span>₹200</span>
          <span className="text-gold">up to ₹{filters.maxPrice.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="mb-4 font-display text-lg text-paper">Availability</h4>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-mist/80 hover:text-paper">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="h-4 w-4 rounded border-black/20 bg-transparent accent-gold"
          />
          In stock only
        </label>
      </div>
    </div>
  );
}

export const DEFAULT_FILTERS: ShopFilters = {
  brands: [],
  maxPrice: PRICE_CEILING,
  inStockOnly: false,
};
