import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

const updateSchema = z.object({ quantity: z.number().int().min(0) });

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const { variantId } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return apiError("Invalid quantity.", 422);

  const cart = await prisma.cart.findUnique({ where: { userId: session.userId } });
  if (!cart) return apiError("Cart not found.", 404);

  if (parsed.data.quantity === 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, variantId } });
  } else {
    await prisma.cartItem.updateMany({
      where: { cartId: cart.id, variantId },
      data: { quantity: parsed.data.quantity },
    });
  }

  return apiOk({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const { variantId } = await params;
  const cart = await prisma.cart.findUnique({ where: { userId: session.userId } });
  if (!cart) return apiError("Cart not found.", 404);

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, variantId } });
  return apiOk({ success: true });
}
