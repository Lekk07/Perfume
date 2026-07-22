import type { Metadata } from "next";
import PolicyLayout from "@/components/layout/PolicyLayout";

export const metadata: Metadata = { title: "Return Policy" };

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout eyebrow="if something's wrong" title="Return Policy" updated="July 2026">
      <p>
        Because decants are opened, single-use products once filled, we're unable to accept
        returns or exchanges based on personal scent preference. That said, we stand behind the
        quality and accuracy of every order we send.
      </p>

      <h2>Eligible for Replacement</h2>
      <ul>
        <li>Item arrived damaged, leaking, or broken in transit</li>
        <li>You received the wrong fragrance or size</li>
        <li>The vial was significantly under-filled compared to the size ordered</li>
      </ul>

      <h2>Not Eligible</h2>
      <ul>
        <li>Change of mind after trying the scent</li>
        <li>Scent didn't perform as expected on your skin chemistry</li>
        <li>Requests made more than 48 hours after delivery</li>
      </ul>

      <h2>How to Request a Replacement</h2>
      <p>
        Email hello@maisonvoile.com within 48 hours of delivery with your order number and a
        photo of the issue. Approved replacements are reshipped at no extra cost; if the item is
        out of stock, we'll issue a refund to your original payment method instead.
      </p>

      <h2>Refund Timing</h2>
      <p>
        Approved refunds are processed within 5–7 business days and returned to your original
        payment method. Cash on Delivery orders are refunded via bank transfer or store credit.
      </p>
    </PolicyLayout>
  );
}
