import type { Product, Accord, ProductReview } from "@/types/product";

// Prisma's generated types aren't available in every environment this file
// might be typechecked in (see README's Module 6 note), so the input here is
// loosely typed. This is the single seam where DB shape meets frontend shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeProduct(db: any, reviews: { rating: number }[] = []): Product {
  const reviewCount = reviews.length;
  const rating =
    reviewCount > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10
      : 0;

  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    brand: db.brand?.name ?? "",
    brandSlug: db.brand?.slug ?? "",
    images: db.images ?? [],
    rating,
    reviewCount,
    category: db.category,
    description: db.description,
    topNotes: db.topNotes ?? [],
    heartNotes: db.heartNotes ?? [],
    baseNotes: db.baseNotes ?? [],
    mainAccords: (db.mainAccords ?? []) as Accord[],
    concentration: db.concentration ?? "",
    isFeatured: db.isFeatured ?? false,
    isBestSeller: db.isBestSeller ?? false,
    variants: (db.variants ?? []).map((v: any) => ({
      id: v.id,
      sizeMl: v.sizeMl,
      price: Number(v.price),
      stock: v.stock,
    })),
    reviews: (db.reviews ?? []).map(
      (r: any): ProductReview => ({
        id: r.id,
        name: r.user?.name ?? "Anonymous",
        rating: r.rating,
        title: r.title ?? undefined,
        comment: r.comment,
        date: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
      })
    ),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeBrand(db: any) {
  return {
    name: db.name as string,
    slug: db.slug as string,
    description: (db.description ?? "") as string,
  };
}
