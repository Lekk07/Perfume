import { NextRequest } from "next/server";
import { createHmac } from "crypto";
import { z } from "zod";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

const schema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return apiError("Razorpay isn't configured on the server yet.", 500);

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError("Invalid payload.", 422);

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;

  const expectedSignature = createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const valid = expectedSignature === razorpaySignature;

  if (!valid) return apiError("Payment verification failed.", 400);

  return apiOk({ verified: true });
}
