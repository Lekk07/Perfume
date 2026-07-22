import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop by Brand",
  description: "Browse decants by the houses that made them.",
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: { where: { isActive: true } } } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <div className="mb-14 flex flex-col items-center text-center">
        <span className="eyebrow">the houses</span>
        <h1 className="mt-3 text-4xl italic text-paper sm:text-5xl">Shop by Brand</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brands/${brand.slug}`}
            className="glass-panel group flex flex-col gap-3 rounded-2xl p-7 transition-all duration-300 hover:border-gold/40"
          >
            <span className="font-display text-2xl text-paper transition-colors group-hover:text-gold">
              {brand.name}
            </span>
            <p className="text-sm leading-relaxed text-mist/70">{brand.description}</p>
            <span className="eyebrow mt-2 text-[10px]">
              {brand._count.products} fragrance{brand._count.products !== 1 ? "s" : ""}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
