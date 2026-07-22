import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductCreateForm from "@/components/admin/ProductCreateForm";

export const metadata: Metadata = { title: "Admin · Add New Perfume" };

export default function AdminNewProductPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <span className="eyebrow">catalog</span>
        <h1 className="mt-3 text-3xl italic text-paper">Add New Perfume</h1>
        <p className="mt-2 text-sm text-mist/60">
          This creates a real product in the database — it goes live immediately.
        </p>
      </div>
      <ProductCreateForm />
    </AdminLayout>
  );
}
