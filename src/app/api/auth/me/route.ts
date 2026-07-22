import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { addresses: true },
  });
  if (!user) return apiError("Not authenticated.", 401);

  return apiOk({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
    },
  });
}

const updateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return apiError("Invalid input.", 422);

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: parsed.data,
  });

  return apiOk({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
}
