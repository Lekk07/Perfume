import type { Metadata } from "next";
import PolicyLayout from "@/components/layout/PolicyLayout";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout eyebrow="how we handle your data" title="Privacy Policy" updated="July 2026">
      <p>
        This policy explains what information Maison Voile collects, how it's used, and the
        choices you have. Using our site means you agree to the practices described here.
      </p>

      <h2>What We Collect</h2>
      <ul>
        <li>Account details: name, email, phone number, password (stored hashed, never in plain text)</li>
        <li>Order details: shipping addresses, order history, payment status (we never store full card numbers — payments are processed by Razorpay)</li>
        <li>Usage data: pages visited, products viewed, and general device/browser information, used to improve the site</li>
      </ul>

      <h2>How We Use It</h2>
      <ul>
        <li>To process and ship your orders</li>
        <li>To send order confirmations, shipping updates, and — only if you opt in — newsletter emails</li>
        <li>To improve our product catalog and site experience</li>
        <li>To prevent fraud and secure your account</li>
      </ul>

      <h2>Who We Share It With</h2>
      <p>
        We share only what's necessary with the services that power our store: Razorpay for
        payment processing, our shipping partners for delivery, and Cloudinary for image hosting.
        We do not sell your personal data to third parties.
      </p>

      <h2>Your Rights</h2>
      <p>
        You can access, update, or delete your account information at any time from your profile,
        or by emailing hello@maisonvoile.com. You can unsubscribe from marketing emails using the
        link in any newsletter.
      </p>

      <h2>Cookies</h2>
      <p>
        We use cookies to keep you logged in, remember your cart, and understand how the site is
        used. You can disable cookies in your browser, though parts of the site may not function
        correctly without them.
      </p>
    </PolicyLayout>
  );
}
