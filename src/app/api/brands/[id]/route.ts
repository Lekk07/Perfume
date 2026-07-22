import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") return apiError("Forbidden.", 403);

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return apiError("Invalid input.", 422);

  if (parsed.data.name) {
    const existing = await prisma.brand.findFirst({
      where: { name: parsed.data.name, NOT: { id } },
    });
    if (existing) return apiError("A brand with this name already exists.", 409);
  }

  if (parsed.data.slug) {
    const existing = await prisma.brand.findFirst({
      where: { slug: parsed.data.slug, NOT: { id } },
    });
    if (existing) return apiError("A brand with this slug already exists.", 409);
  }

  const brand = await prisma.brand.update({ where: { id }, data: parsed.data });
  return apiOk({ brand });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") return apiError("Forbidden.", 403);

  const { id } = await params;

  const productCount = await prisma.product.count({ where: { brandId: id } });
  if (productCount > 0) {
    return apiError(
      `This brand has ${productCount} product${productCount !== 1 ? "s" : ""} attached. Reassign or remove them before deleting the brand.`,
      409
    );
  }

  await prisma.brand.delete({ where: { id } });
  return apiOk({ success: true });
}
