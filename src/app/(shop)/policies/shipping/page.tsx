import type { Metadata } from "next";
import PolicyLayout from "@/components/layout/PolicyLayout";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout eyebrow="how it gets to you" title="Shipping Policy" updated="July 2026">
      <p>
        We aim to get your decants to you as quickly and safely as possible, without compromising
        on how carefully they're packed.
      </p>

      <h2>Processing Time</h2>
      <p>
        Orders placed before 3:00 PM IST on a business day are decanted and dispatched the same
        day. Orders placed after that, or on weekends and public holidays, ship the following
        business day.
      </p>

      <h2>Delivery Estimates</h2>
      <ul>
        <li>Metro cities: 2–4 business days</li>
        <li>Other cities and towns: 4–6 business days</li>
        <li>Remote or rural pin codes: up to 8 business days</li>
      </ul>

      <h2>Shipping Fees</h2>
      <p>
        Shipping is free on orders over ₹1,500. Orders below that threshold carry a flat ₹79
        shipping fee, calculated at checkout.
      </p>

      <h2>Packaging</h2>
      <p>
        Every vial is individually cushioned and sealed with a leak-proof glass atomizer before
        being boxed for transit. If anything arrives damaged, contact us within 48 hours of
        delivery with a photo and we'll send a replacement.
      </p>

      <h2>Tracking</h2>
      <p>
        You'll receive a tracking link by email and SMS as soon as your order is dispatched. You
        can also view order status anytime from your account's Order History page.
      </p>
    </PolicyLayout>
  );
}
