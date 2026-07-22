import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";

const schema = z.object({ code: z.string().min(1), subtotal: z.number().nonnegative() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError("Invalid request.", 422);

  const code = parsed.data.code.trim().toUpperCase();
  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon) return apiOk({ valid: false, message: "That coupon code isn't valid." });
  if (!coupon.isActive) return apiOk({ valid: false, message: "This coupon is no longer active." });
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return apiOk({ valid: false, message: "This coupon has expired." });
  }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return apiOk({ valid: false, message: "This coupon has reached its usage limit." });
  }
  if (coupon.minOrderValue && parsed.data.subtotal < Number(coupon.minOrderValue)) {
    return apiOk({
      valid: false,
      message: `This coupon requires a minimum order of ₹${coupon.minOrderValue}.`,
    });
  }

  return apiOk({
    valid: true,
    percentOff: coupon.percentOff,
    message: `${coupon.percentOff}% off applied.`,
  });
}
