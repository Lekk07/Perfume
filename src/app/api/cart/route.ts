import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

async function getOrCreateCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: { include: { brand: true } }, variant: true } } },
  });
  if (cart) return cart;
  return prisma.cart.create({
    data: { userId },
    include: { items: { include: { product: { include: { brand: true } }, variant: true } } },
  });
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const cart = await getOrCreateCart(session.userId);
  return apiOk({ cart });
}

const addSchema = z.object({
  variantId: z.string(),
  quantity: z.number().int().positive().default(1),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const body = await req.json().catch(() => null);
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) return apiError("Invalid item.", 422);

  const variant = await prisma.productVariant.findUnique({ where: { id: parsed.data.variantId } });
  if (!variant) return apiError("Product size not found.", 404);

  const cart = await getOrCreateCart(session.userId);

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId: variant.id } },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: Math.min(existing.quantity + parsed.data.quantity, variant.stock) },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: variant.productId,
        variantId: variant.id,
        quantity: Math.min(parsed.data.quantity, variant.stock),
      },
    });
  }

  const updated = await getOrCreateCart(session.userId);
  return apiOk({ cart: updated });
}

export async function DELETE() {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const cart = await prisma.cart.findUnique({ where: { userId: session.userId } });
  if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return apiOk({ success: true });
}
