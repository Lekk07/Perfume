import { Suspense } from "react";
import type { Metadata } from "next";
import OrderConfirmationContent from "@/components/checkout/OrderConfirmationContent";

export const metadata: Metadata = { title: "Order Confirmed" };

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
