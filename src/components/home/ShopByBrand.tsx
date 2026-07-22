import Link from "next/link";

export default function ShopByBrand({ brands }: { brands: { name: string; slug: string }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mb-10 text-center">
        <span className="eyebrow">the houses</span>
        <h2 className="mt-3 text-4xl italic text-paper sm:text-5xl">Shop by Brand</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brands/${brand.slug}`}
            className="glass-panel group flex h-28 items-center justify-center rounded-2xl px-4 text-center transition-all duration-300 hover:border-gold/40"
          >
            <span className="font-display text-lg text-paper transition-colors group-hover:text-gold">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
