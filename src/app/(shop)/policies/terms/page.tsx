import type { Metadata } from "next";
import PolicyLayout from "@/components/layout/PolicyLayout";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <PolicyLayout eyebrow="the fine print" title="Terms & Conditions" updated="July 2026">
      <p>
        These terms govern your use of the Maison Voile website and any purchase made through it.
        By placing an order, you agree to the terms below.
      </p>

      <h2>Orders & Pricing</h2>
      <p>
        All prices are listed in Indian Rupees (₹) and include applicable taxes unless stated
        otherwise. We reserve the right to correct pricing errors and to cancel orders placed at
        an incorrect price, with a full refund issued in that case.
      </p>

      <h2>Product Authenticity</h2>
      <p>
        All fragrances are decanted from authentic bottles sourced through authorized retailers.
        We do not sell counterfeit, clone, or "inspired by" fragrances under the name of the
        original house.
      </p>

      <h2>Account Responsibility</h2>
      <p>
        You're responsible for keeping your account credentials confidential and for all activity
        under your account. Notify us immediately if you suspect unauthorized access.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are processed securely through Razorpay, or via Cash on Delivery where available.
        Orders are confirmed only once payment is verified or, for COD, once the order is placed.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        Maison Voile is not liable for indirect or consequential damages arising from product use,
        including skin sensitivity or allergic reactions. We recommend a patch test before full
        application for anyone with sensitive skin.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the site after changes are
        posted constitutes acceptance of the revised terms.
      </p>
    </PolicyLayout>
  );
}
