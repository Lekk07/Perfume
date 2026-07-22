"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar, { DEFAULT_FILTERS, type ShopFilters } from "@/components/shop/FilterSidebar";
import SortDropdown, { type SortOption } from "@/components/shop/SortDropdown";
import type { Product } from "@/types/product";

const PAGE_SIZE = 8;

export default function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("popularity");
  const [search, setSearch] = useState(initialSearch);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    filters.brands.forEach((b) => params.append("brand", b));
    params.set("maxPrice", String(filters.maxPrice));
    if (filters.inStockOnly) params.set("inStockOnly", "true");
    params.set("sort", sort);
    params.set("pageSize", String(pageSize));

    fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Failed to load products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [search, filters, sort, pageSize]);

  const hasMore = pageSize < total;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      {/* Heading */}
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="eyebrow">the full atelier</span>
        <h1 className="mt-3 text-4xl italic text-paper sm:text-5xl">Shop All Perfumes</h1>
        <p className="mt-4 max-w-md text-sm text-mist/70">
          {total} fragrance{total !== 1 ? "s" : ""} available in decant sizes
        </p>
      </div>

      {/* Search + sort bar */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageSize(PAGE_SIZE);
            }}
            placeholder="Search by perfume or brand…"
            className="w-full rounded-full border border-black/15 bg-transparent px-5 py-2.5 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none sm:w-80"
          />
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-xs uppercase tracking-label text-paper hover:border-gold/50 hover:text-gold lg:hidden"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        {/* Desktop filters */}
        <FilterSidebar
          filters={filters}
          onChange={(f) => {
            setFilters(f);
            setPageSize(PAGE_SIZE);
          }}
          onReset={() => setFilters(DEFAULT_FILTERS)}
          className="hidden lg:flex"
        />

        {/* Grid */}
        <div>
          {error && (
            <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {!error && loading && products.length === 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-black/[0.03]" />
              ))}
            </div>
          ) : !error && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <p className="font-display text-2xl text-paper">No fragrances match those filters.</p>
              <p className="text-sm text-mist/60">Try widening your price range or clearing filters.</p>
            </div>
          ) : (
            !error && (
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )
          )}

          {hasMore && !loading && (
            <div className="mt-14 flex justify-center">
              <button onClick={() => setPageSize((s) => s + PAGE_SIZE)} className="btn-ghost">
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[70] flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-ink-raised p-8">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mb-8 self-end p-2 text-paper hover:text-gold"
              aria-label="Close filters"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
            <FilterSidebar
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setPageSize(PAGE_SIZE);
              }}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
