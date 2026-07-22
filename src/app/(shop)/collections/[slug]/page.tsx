import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import ProductCard from "@/components/product/ProductCard";
import type { PerfumeCategory } from "@/types/product";

export const dynamic = "force-dynamic";

const COLLECTIONS: Record<string, { title: string; blurb: string; category: PerfumeCategory }> = {
  designer: {
    title: "Designer Perfumes",
    blurb: "Iconic houses and instantly recognizable signatures.",
    category: "DESIGNER",
  },
  niche: {
    title: "Niche Perfumes",
    blurb: "Independent and artisanal perfumery, made for those who want something different.",
    category: "NICHE",
  },
  mens: {
    title: "Men's Perfumes",
    blurb: "Woody, spiced, and confident compositions.",
    category: "MENS",
  },
  womens: {
    title: "Women's Perfumes",
    blurb: "Floral, gourmand, and radiant fragrances.",
    category: "WOMENS",
  },
  unisex: {
    title: "Unisex Perfumes",
    blurb: "Fragrances that move beyond gendered categories entirely.",
    category: "UNISEX",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];
  if (!collection) return {};
  return { title: collection.title, description: collection.blurb };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];
  if (!collection) notFound();

  const dbProducts = await prisma.product.findMany({
    where: { category: collection.category, isActive: true },
    include: { brand: true, variants: true, reviews: { select: { rating: true } } },
  });
  const products = dbProducts.map((p) => serializeProduct(p, p.reviews));

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <div className="mb-14 flex flex-col items-center text-center">
        <span className="eyebrow">collection</span>
        <h1 className="mt-3 text-4xl italic text-paper sm:text-5xl">{collection.title}</h1>
        <p className="mt-4 max-w-md text-sm text-mist/70">{collection.blurb}</p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <p className="font-display text-2xl text-paper">More arriving in this collection soon.</p>
          <p className="text-sm text-mist/60">Check back shortly, or browse the full shop.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
