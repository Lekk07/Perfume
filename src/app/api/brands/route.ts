import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

export async function GET() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return apiOk({ brands });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") return apiError("Forbidden.", 403);

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid brand data.", 422);
  }

  const slug = slugify(parsed.data.slug || parsed.data.name);

  const existingName = await prisma.brand.findUnique({ where: { name: parsed.data.name } });
  if (existingName) return apiError("A brand with this name already exists.", 409);

  const existingSlug = await prisma.brand.findUnique({ where: { slug } });
  if (existingSlug) return apiError("A brand with this slug already exists.", 409);

  const brand = await prisma.brand.create({
    data: { name: parsed.data.name, slug, description: parsed.data.description, logoUrl: parsed.data.logoUrl },
  });

  return apiOk({ brand }, 201);
}
