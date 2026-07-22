import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

const schema = z.object({
  description: z.string().optional(),
  percentOff: z.number().int().min(1).max(100).optional(),
  minOrderValue: z.number().nonnegative().optional(),
  maxUses: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") return apiError("Forbidden.", 403);

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError("Invalid input.", 422);

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
    },
  });

  return apiOk({ coupon });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") return apiError("Forbidden.", 403);

  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return apiOk({ success: true });
}
