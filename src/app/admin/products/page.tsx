import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { brand: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">catalog</span>
          <h1 className="mt-3 text-3xl italic text-paper">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-gold px-5 py-2.5 text-xs font-medium uppercase tracking-label text-paper transition-colors hover:bg-gold-light"
        >
          + Add New Perfume
        </Link>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-xs uppercase tracking-label text-mist/50">
              <th className="px-6 py-4">Perfume</th>
              <th className="hidden px-6 py-4 sm:table-cell">Category</th>
              <th className="hidden px-6 py-4 sm:table-cell">Status</th>
              <th className="px-6 py-4 text-right">Edit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-black/[0.06] last:border-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-display text-base text-paper">{product.name}</p>
                      <p className="text-xs text-mist/50">{product.brand.name}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-6 py-4 text-mist/70 sm:table-cell">{product.category}</td>
                <td className="hidden px-6 py-4 sm:table-cell">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-label",
                      product.isActive ? "border-gold/30 text-gold" : "border-black/15 text-mist/40"
                    )}
                  >
                    {product.isActive ? "Published" : "Unpublished"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-xs text-paper hover:border-gold/50 hover:text-gold"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
