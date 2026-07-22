import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductFragranceForm from "@/components/admin/ProductFragranceForm";
import InventoryForm from "@/components/admin/InventoryForm";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Edit Perfume" };

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await prisma.product.findUnique({
    where: { id },
    include: { brand: true, variants: true, reviews: { select: { rating: true } } },
  });
  if (!db) notFound();

  const product = serializeProduct(db, db.reviews);

  return (
    <AdminLayout>
      <div className="mb-8">
        <span className="eyebrow">edit perfume</span>
        <h1 className="mt-3 text-3xl italic text-paper">{product.name}</h1>
        <p className="mt-2 text-sm text-mist/60">
          Changes save instantly to the database and reflect on the live product page.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <InventoryForm product={product} isActive={db.isActive} />
        <ProductFragranceForm product={product} />
      </div>
    </AdminLayout>
  );
}
