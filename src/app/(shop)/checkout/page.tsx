import type { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";
import CheckoutPage from "@/components/checkout/CheckoutPage";

export const metadata: Metadata = { title: "Checkout" };

export default function Page() {
  return (
    <AuthGuard>
      <CheckoutPage />
    </AuthGuard>
  );
}
