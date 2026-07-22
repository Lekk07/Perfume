import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError("Enter a valid email address.", 422);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });

  // Always respond the same way whether or not the account exists, so we
  // don't leak which emails are registered.
  if (user) {
    const token = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      },
    });
    // NOTE: no email service is configured yet — sending the reset link
    // (e.g. via Resend/SendGrid) is a follow-up. The token is generated and
    // stored so that piece can be added without touching this route's shape.
  }

  return apiOk({
    message: "If an account exists for that email, a reset link has been sent.",
  });
}
