import { Suspense } from "react";
import type { Metadata } from "next";
import ShopContent from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "Shop All Perfumes",
  description: "Browse 300+ designer and niche perfume decants, 2ml to 10ml.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ShopContent />
    </Suspense>
  );
}
