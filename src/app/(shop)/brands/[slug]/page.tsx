import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import ProductCard from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

async function getBrand(slug: string) {
  return prisma.brand.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return {};
  return { title: brand.name, description: brand.description ?? undefined };
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const dbProducts = await prisma.product.findMany({
    where: { brandId: brand.id, isActive: true },
    include: { brand: true, variants: true, reviews: { select: { rating: true } } },
  });
  const products = dbProducts.map((p) => serializeProduct(p, p.reviews));

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <div className="mb-14 flex flex-col items-center text-center">
        <span className="eyebrow">the house of</span>
        <h1 className="mt-3 text-4xl italic text-paper sm:text-5xl">{brand.name}</h1>
        <p className="mt-4 max-w-md text-sm text-mist/70">{brand.description}</p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <p className="font-display text-2xl text-paper">No decants from this house yet.</p>
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
