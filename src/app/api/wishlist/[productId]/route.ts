import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const { productId } = await params;
  await prisma.wishlistItem.deleteMany({ where: { userId: session.userId, productId } });

  return apiOk({ success: true });
}
