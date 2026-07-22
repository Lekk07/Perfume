import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";
import { serializeProduct } from "@/lib/serialize";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const category = searchParams.get("category")?.toUpperCase();
  const brandSlugs = searchParams.getAll("brand");
  const maxPrice = searchParams.get("maxPrice");
  const inStockOnly = searchParams.get("inStockOnly") === "true";
  const sort = searchParams.get("sort") ?? "popularity";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(48, Math.max(1, Number(searchParams.get("pageSize") ?? "8")));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { brand: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (category) where.category = category;
  if (brandSlugs.length > 0) where.brand = { slug: { in: brandSlugs } };
  if (inStockOnly) where.variants = { some: { stock: { gt: 0 } } };

  const orderBy =
    sort === "newest" ? { createdAt: "desc" as const } : undefined; // price/popularity sorted after fetch

  const products = await prisma.product.findMany({
    where,
    include: { brand: true, variants: true, reviews: { select: { rating: true } } },
    orderBy,
  });

  const serialized = products.map((p) => serializeProduct(p, p.reviews));

  let filtered = serialized;
  if (maxPrice) {
    const max = Number(maxPrice);
    filtered = filtered.filter((p) => Math.min(...p.variants.map((v) => v.price)) <= max);
  }

  if (sort === "price-asc" || sort === "price-desc") {
    filtered = [...filtered].sort((a, b) => {
      const aLow = Math.min(...a.variants.map((v) => v.price));
      const bLow = Math.min(...b.variants.map((v) => v.price));
      return sort === "price-asc" ? aLow - bLow : bLow - aLow;
    });
  } else if (sort === "popularity") {
    filtered = [...filtered].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return apiOk({ products: pageItems, total, page, pageSize });
}

const variantSchema = z.object({
  sizeMl: z.number().int().positive(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
});

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  brandId: z.string(),
  category: z.enum(["DESIGNER", "NICHE", "MENS", "WOMENS", "UNISEX"]),
  description: z.string().min(1),
  topNotes: z.array(z.string()).default([]),
  heartNotes: z.array(z.string()).default([]),
  baseNotes: z.array(z.string()).default([]),
  mainAccords: z.array(z.object({ name: z.string(), intensity: z.number().min(0).max(100) })).default([]),
  concentration: z.string().optional(),
  images: z.array(z.string()).default([]),
  variants: z.array(variantSchema).min(1),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") return apiError("Forbidden.", 403);

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid product data.", 422);
  }

  const { variants, ...data } = parsed.data;

  const existingSlug = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existingSlug) return apiError("A product with this slug already exists.", 409);

  const product = await prisma.product.create({
    data: {
      ...data,
      mainAccords: data.mainAccords,
      variants: { create: variants },
    },
    include: { brand: true, variants: true },
  });

  return apiOk({ product }, 201);
}
