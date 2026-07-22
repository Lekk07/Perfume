import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      variants: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product || !product.isActive) return apiError("Product not found.", 404);

  return apiOk({ product });
}

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.enum(["DESIGNER", "NICHE", "MENS", "WOMENS", "UNISEX"]).optional(),
  description: z.string().optional(),
  topNotes: z.array(z.string()).optional(),
  heartNotes: z.array(z.string()).optional(),
  baseNotes: z.array(z.string()).optional(),
  mainAccords: z.array(z.object({ name: z.string(), intensity: z.number().min(0).max(100) })).optional(),
  concentration: z.string().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  variants: z
    .array(z.object({ id: z.string(), price: z.number().nonnegative(), stock: z.number().int().nonnegative() }))
    .optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") return apiError("Forbidden.", 403);

  const { slug } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input.", 422);

  const { variants, ...data } = parsed.data;

  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return apiError("Product not found.", 404);

  if (variants) {
    await Promise.all(
      variants.map((v) =>
        prisma.productVariant.update({ where: { id: v.id }, data: { price: v.price, stock: v.stock } })
      )
    );
  }

  const updated = await prisma.product.update({
    where: { slug },
    data,
    include: { brand: true, variants: true },
  });

  return apiOk({ product: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") return apiError("Forbidden.", 403);

  const { slug } = await params;
  // Soft delete — keeps order history referencing this product intact.
  await prisma.product.update({ where: { slug }, data: { isActive: false } });

  return apiOk({ success: true });
}
