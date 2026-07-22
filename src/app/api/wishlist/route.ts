import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.userId },
    include: { product: { include: { brand: true, variants: true } } },
    orderBy: { createdAt: "desc" },
  });

  return apiOk({ items });
}

const schema = z.object({ productId: z.string() });

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError("Invalid product.", 422);

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.userId, productId: parsed.data.productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return apiOk({ wishlisted: false });
  }

  await prisma.wishlistItem.create({
    data: { userId: session.userId, productId: parsed.data.productId },
  });
  return apiOk({ wishlisted: true });
}
