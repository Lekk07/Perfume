import type { Product } from "@/types/product";

export default function ProductHeader({ product }: { product: Product }) {
  return (
    <div>
      <span className="eyebrow">{product.brand}</span>
      <h1 className="mt-2 font-display text-4xl italic text-paper">{product.name}</h1>
      <p className="mt-2 text-xs uppercase tracking-label text-mist/60">{product.concentration}</p>
    </div>
  );
}
