import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/api-response";
import { verifyPassword, signSession, sessionCookieOptions, COOKIE_NAME } from "@/lib/auth-server";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError("Enter a valid email and password.", 422);
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    return apiError("Incorrect email or password.", 401);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return apiError("Incorrect email or password.", 401);
  }

  const token = await signSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const response = apiOk({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  response.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
  return response;
}
