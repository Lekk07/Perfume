import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const addresses = await prisma.address.findMany({ where: { userId: session.userId } });
  return apiOk({ addresses });
}

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().min(2).default("India"),
  isDefault: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid address.", 422);

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { ...parsed.data, userId: session.userId },
  });

  return apiOk({ address }, 201);
}
