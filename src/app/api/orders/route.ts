import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

function generateOrderNumber(): string {
  return `MV${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  if (all && session.role !== "ADMIN") return apiError("Forbidden.", 403);

  const orders = await prisma.order.findMany({
    where: all ? {} : { userId: session.userId },
    include: {
      items: { include: { product: true, variant: true } },
      address: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return apiOk({ orders });
}

const schema = z.object({
  addressId: z.string(),
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
  couponCode: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
});

const SHIPPING_FEE = 79;
const FREE_SHIPPING_THRESHOLD = 1500;

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError("Invalid order data.", 422);

  const address = await prisma.address.findUnique({ where: { id: parsed.data.addressId } });
  if (!address || address.userId !== session.userId) return apiError("Invalid shipping address.", 400);

  const cart = await prisma.cart.findUnique({
    where: { userId: session.userId },
    include: { items: { include: { variant: true, product: true } } },
  });
  if (!cart || cart.items.length === 0) return apiError("Your cart is empty.", 400);

  // Verify stock before committing.
  for (const item of cart.items) {
    if (item.quantity > item.variant.stock) {
      return apiError(`${item.product.name} (${item.variant.sizeMl}ml) no longer has enough stock.`, 409);
    }
  }

  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);

  let discount = 0;
  let coupon = null;
  if (parsed.data.couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: parsed.data.couponCode.toUpperCase() } });
    if (coupon && coupon.isActive) {
      discount = (subtotal * coupon.percentOff) / 100;
    }
  }

  const shippingFee = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shippingFee;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.userId,
        addressId: address.id,
        subtotal,
        discount,
        shippingFee,
        total,
        couponId: coupon?.id,
        paymentMethod: parsed.data.paymentMethod,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.variant.price,
          })),
        },
        payment: {
          create: {
            method: parsed.data.paymentMethod,
            status: parsed.data.paymentMethod === "COD" ? "PENDING" : "PAID",
            amount: total,
            razorpayOrderId: parsed.data.razorpayOrderId,
            razorpayPaymentId: parsed.data.razorpayPaymentId,
            razorpaySignature: parsed.data.razorpaySignature,
          },
        },
      },
      include: { items: true, address: true, payment: true },
    });

    // Decrement stock.
    for (const item of cart.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (coupon) {
      await tx.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return created;
  });

  return apiOk({ order }, 201);
}
