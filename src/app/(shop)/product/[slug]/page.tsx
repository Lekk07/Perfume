import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import ProductGallery from "@/components/product/ProductGallery";
import ProductHeader from "@/components/product/ProductHeader";
import MainAccords from "@/components/product/MainAccords";
import ProductPurchasePanel from "@/components/product/ProductPurchasePanel";
import FragrancePyramid from "@/components/product/FragrancePyramid";

// Rendered per-request against the database rather than statically generated,
// so admin-created or admin-edited products (price, stock, fragrance profile)
// show up immediately without a rebuild.
export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  const db = await prisma.product.findUnique({
    where: { slug },
    include: { brand: true, variants: true, reviews: { select: { rating: true } } },
  });
  if (!db || !db.isActive) return null;
  return serializeProduct(db, db.reviews);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.brand}`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={`${product.brand} ${product.name}`} />
        <div className="flex flex-col gap-10">
          <ProductHeader product={product} />
          <MainAccords accords={product.mainAccords} />
          <ProductPurchasePanel product={product} />
        </div>
      </div>

      <div className="mt-20">
        <FragrancePyramid
          topNotes={product.topNotes}
          heartNotes={product.heartNotes}
          baseNotes={product.baseNotes}
        />
      </div>
    </div>
  );
}
