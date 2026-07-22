export type PerfumeCategory = "DESIGNER" | "NICHE" | "MENS" | "WOMENS" | "UNISEX";

export interface ProductVariant {
  id: string;
  sizeMl: number;
  price: number;
  stock: number;
}

export interface ProductReview {
  id: string;
  name: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
}

export interface Accord {
  name: string;
  intensity: number; // 0–100
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  images: string[];
  rating: number;
  reviewCount: number;
  category: PerfumeCategory;
  description: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  mainAccords: Accord[];
  concentration: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  variants: ProductVariant[];
  reviews: ProductReview[];
}

// Backward-compatible alias used by the homepage card components
export type ProductCardData = Product;

export interface Brand {
  name: string;
  slug: string;
  description: string;
}
