import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

const schema = z.object({ amount: z.number().positive() });

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return apiError("Not authenticated.", 401);

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return apiError("Razorpay isn't configured on the server yet.", 500);
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError("Invalid amount.", 422);

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  const order = await razorpay.orders.create({
    amount: Math.round(parsed.data.amount * 100), // paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  return apiOk({ orderId: order.id, amount: order.amount, currency: order.currency });
}
