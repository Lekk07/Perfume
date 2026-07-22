import type { Product, Brand, ProductReview } from "@/types/product";

// Temporary in-memory catalog so the storefront modules are fully browsable
// before the database + API modules are connected in a later pass.

function reviews(seed: number): ProductReview[] {
  const pool: ProductReview[] = [
    {
      id: `r${seed}a`,
      name: "Aditi R.",
      rating: 5,
      title: "Exactly as described",
      comment:
        "Longevity was way better than I expected from a decant. Packaging was leak-proof and arrived in two days.",
      date: "2026-05-14",
    },
    {
      id: `r${seed}b`,
      name: "Karan M.",
      rating: 4,
      title: "Great way to try before buying full bottle",
      comment:
        "Loved the scent on first application, settled into something even better after an hour. Would reorder in a bigger size.",
      date: "2026-04-02",
    },
    {
      id: `r${seed}c`,
      name: "Meera S.",
      rating: 5,
      comment:
        "This is now my go-to evening scent. The vial itself feels premium, not like a cheap sample.",
      date: "2026-03-21",
    },
  ];
  return pool;
}

export const BRANDS: Brand[] = [
  { name: "Le Labo", slug: "le-labo", description: "Hand-blended, minimalist Brooklyn perfumery." },
  { name: "Maison Francis Kurkdjian", slug: "mfk", description: "Parisian haute perfumery known for radiant, technical compositions." },
  { name: "Tom Ford", slug: "tom-ford", description: "Bold, opulent fragrances from the Private Blend collection." },
  { name: "Dior", slug: "dior", description: "Iconic French maison spanning classic and modern perfumery." },
  { name: "Parfums de Marly", slug: "parfums-de-marly", description: "Equestrian-inspired luxury with a modern French sensibility." },
  { name: "Creed", slug: "creed", description: "Centuries-old house famed for its niche, aristocratic scents." },
  { name: "Amouage", slug: "amouage", description: "Omani luxury perfumery known for opulent, maximalist blends." },
  { name: "Byredo", slug: "byredo", description: "Swedish niche house built on evocative, memory-driven scents." },
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "santal-33",
    name: "Santal 33",
    brand: "Le Labo",
    brandSlug: "le-labo",
    images: [
      "https://images.unsplash.com/photo-1595425964272-6a5db3d64e7c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 214,
    category: "UNISEX",
    description:
      "A smoky, leathery sandalwood built around a rare blend of Australian sandalwood, cardamom, and violet. Unisex, instantly recognizable, and famously long-lasting.",
    topNotes: ["Cardamom", "Violet", "Iris"],
    heartNotes: ["Sandalwood", "Papyrus"],
    baseNotes: ["Cedarwood", "Amber", "Leather", "Musk"],
    concentration: "Eau de Parfum",
    mainAccords: [
      { name: "Woody", intensity: 95 },
      { name: "Amber", intensity: 78 },
      { name: "Leather", intensity: 62 },
      { name: "Musky", intensity: 55 },
      { name: "Powdery", intensity: 40 },
    ],
    isFeatured: true,
    variants: [
      { id: "v1", sizeMl: 2, price: 449, stock: 20 },
      { id: "v2", sizeMl: 5, price: 899, stock: 12 },
      { id: "v3", sizeMl: 10, price: 1599, stock: 6 },
    ],
    reviews: reviews(1),
  },
  {
    id: "2",
    slug: "baccarat-rouge-540",
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    brandSlug: "mfk",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615368144592-04e0efb9b2ff?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 402,
    category: "NICHE",
    description:
      "An amber-floral signature scent built around saffron and ambergris, radiant and unmistakable on skin. One of the most decanted fragrances of the last decade.",
    topNotes: ["Saffron", "Jasmine"],
    heartNotes: ["Amberwood", "Fir Resin"],
    baseNotes: ["Ambergris", "Cedarwood"],
    concentration: "Eau de Parfum",
    mainAccords: [
      { name: "Amber", intensity: 96 },
      { name: "Sweet", intensity: 80 },
      { name: "Floral", intensity: 65 },
      { name: "Woody", intensity: 58 },
      { name: "Warm Spicy", intensity: 42 },
    ],
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { id: "v4", sizeMl: 2, price: 599, stock: 18 },
      { id: "v5", sizeMl: 5, price: 1199, stock: 9 },
      { id: "v6", sizeMl: 10, price: 2199, stock: 4 },
    ],
    reviews: reviews(2),
  },
  {
    id: "3",
    slug: "sauvage-elixir",
    name: "Sauvage Elixir",
    brand: "Dior",
    brandSlug: "dior",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 331,
    category: "MENS",
    description:
      "A concentrated, spicy-woody take on the Sauvage line — cinnamon and lavender essence over a smoky vetiver-tobacco base. Built for cold-weather longevity.",
    topNotes: ["Cinnamon", "Cardamom", "Lavender"],
    heartNotes: ["Nutmeg", "Star Anise"],
    baseNotes: ["Tobacco", "Vetiver", "Sandalwood"],
    concentration: "Parfum",
    mainAccords: [
      { name: "Warm Spicy", intensity: 92 },
      { name: "Woody", intensity: 84 },
      { name: "Aromatic", intensity: 70 },
      { name: "Tobacco", intensity: 55 },
      { name: "Amber", intensity: 38 },
    ],
    isFeatured: true,
    variants: [
      { id: "v7", sizeMl: 2, price: 349, stock: 30 },
      { id: "v8", sizeMl: 5, price: 699, stock: 16 },
      { id: "v9", sizeMl: 8, price: 1099, stock: 14 },
    ],
    reviews: reviews(3),
  },
  {
    id: "4",
    slug: "delina",
    name: "Delina",
    brand: "Parfums de Marly",
    brandSlug: "parfums-de-marly",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 187,
    category: "WOMENS",
    description:
      "A modern rose-lychee gourmand with a soft, powdery musk drydown. Feminine and romantic without tipping into sweetness.",
    topNotes: ["Lychee", "Rhubarb", "Bergamot"],
    heartNotes: ["Turkish Rose", "Peony"],
    baseNotes: ["Musk", "Cashmeran", "Vanilla"],
    concentration: "Eau de Parfum",
    mainAccords: [
      { name: "Floral", intensity: 94 },
      { name: "Fruity", intensity: 76 },
      { name: "Musky", intensity: 68 },
      { name: "Powdery", intensity: 52 },
      { name: "Vanilla", intensity: 44 },
    ],
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { id: "v10", sizeMl: 2, price: 449, stock: 22 },
      { id: "v11", sizeMl: 5, price: 899, stock: 10 },
    ],
    reviews: reviews(4),
  },
  {
    id: "5",
    slug: "oud-wood",
    name: "Oud Wood",
    brand: "Tom Ford",
    brandSlug: "tom-ford",
    images: [
      "https://images.unsplash.com/photo-1615368144592-04e0efb9b2ff?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595425964272-6a5db3d64e7c?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 256,
    category: "UNISEX",
    description:
      "Smoky rare oud wood softened with rosewood and sandalwood, warmed by amber and vanilla. Rich, resinous, and unmistakably Private Blend.",
    topNotes: ["Rosewood", "Cardamom"],
    heartNotes: ["Oud", "Sandalwood"],
    baseNotes: ["Amber", "Vanilla", "Tonka Bean"],
    concentration: "Eau de Parfum",
    mainAccords: [
      { name: "Woody", intensity: 97 },
      { name: "Oud", intensity: 88 },
      { name: "Amber", intensity: 65 },
      { name: "Warm Spicy", intensity: 50 },
      { name: "Vanilla", intensity: 36 },
    ],
    isBestSeller: true,
    variants: [
      { id: "v12", sizeMl: 2, price: 549, stock: 25 },
      { id: "v13", sizeMl: 5, price: 1099, stock: 11 },
    ],
    reviews: reviews(5),
  },
  {
    id: "6",
    slug: "aventus",
    name: "Aventus",
    brand: "Creed",
    brandSlug: "creed",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 512,
    category: "MENS",
    description:
      "The benchmark fruity-smoky men's fragrance — pineapple and blackcurrant over a birch and oakmoss base. Confident, sharp, and enduringly popular.",
    topNotes: ["Pineapple", "Blackcurrant", "Bergamot"],
    heartNotes: ["Birch", "Patchouli", "Jasmine"],
    baseNotes: ["Oakmoss", "Musk", "Ambergris"],
    concentration: "Eau de Parfum",
    mainAccords: [
      { name: "Fruity", intensity: 90 },
      { name: "Smoky", intensity: 74 },
      { name: "Woody", intensity: 68 },
      { name: "Musky", intensity: 55 },
      { name: "Fresh", intensity: 40 },
    ],
    isBestSeller: true,
    variants: [
      { id: "v14", sizeMl: 2, price: 599, stock: 28 },
      { id: "v15", sizeMl: 5, price: 1199, stock: 13 },
      { id: "v16", sizeMl: 10, price: 2299, stock: 5 },
    ],
    reviews: reviews(6),
  },
  {
    id: "7",
    slug: "interlude-man",
    name: "Interlude Man",
    brand: "Amouage",
    brandSlug: "amouage",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615368144592-04e0efb9b2ff?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 98,
    category: "NICHE",
    description:
      "A dense, incense-heavy oriental built for cold weather — smoke, spice, and leather layered over amber. Intense and long-lasting.",
    topNotes: ["Bergamot", "Oregano", "Pepper"],
    heartNotes: ["Frankincense", "Papyrus"],
    baseNotes: ["Amber", "Leather", "Styrax"],
    concentration: "Eau de Parfum",
    mainAccords: [
      { name: "Smoky", intensity: 93 },
      { name: "Amber", intensity: 82 },
      { name: "Warm Spicy", intensity: 70 },
      { name: "Leather", intensity: 58 },
      { name: "Incense", intensity: 46 },
    ],
    variants: [
      { id: "v17", sizeMl: 2, price: 499, stock: 15 },
      { id: "v18", sizeMl: 5, price: 999, stock: 8 },
    ],
    reviews: reviews(7),
  },
  {
    id: "8",
    slug: "gypsy-water",
    name: "Gypsy Water",
    brand: "Byredo",
    brandSlug: "byredo",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 143,
    category: "UNISEX",
    description:
      "An airy, bohemian woody-citrus scent — juniper and bergamot over vanilla and sandalwood. Effortless, easy to wear year-round.",
    topNotes: ["Bergamot", "Lemon", "Pepper"],
    heartNotes: ["Incense", "Pine Needles", "Orris"],
    baseNotes: ["Vanilla", "Sandalwood", "Amber"],
    concentration: "Eau de Parfum",
    mainAccords: [
      { name: "Fresh", intensity: 85 },
      { name: "Woody", intensity: 70 },
      { name: "Vanilla", intensity: 58 },
      { name: "Citrus", intensity: 50 },
      { name: "Incense", intensity: 38 },
    ],
    variants: [
      { id: "v19", sizeMl: 2, price: 399, stock: 20 },
      { id: "v20", sizeMl: 5, price: 799, stock: 12 },
    ],
    reviews: reviews(8),
  },
  {
    id: "9",
    slug: "another-13",
    name: "Another 13",
    brand: "Le Labo",
    brandSlug: "le-labo",
    images: [
      "https://images.unsplash.com/photo-1615368144592-04e0efb9b2ff?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 121,
    category: "UNISEX",
    description:
      "A clean, skin-like musk with an ambrette and iso E super base — feels like a more refined version of your own skin.",
    topNotes: ["Ambrette Seeds", "Bergamot"],
    heartNotes: ["Musk", "Iso E Super"],
    baseNotes: ["Amberwood", "Musk"],
    concentration: "Eau de Parfum",
    mainAccords: [
      { name: "Musky", intensity: 90 },
      { name: "Woody", intensity: 66 },
      { name: "Fresh", intensity: 55 },
      { name: "Amber", intensity: 48 },
      { name: "Citrus", intensity: 30 },
    ],
    variants: [
      { id: "v21", sizeMl: 2, price: 429, stock: 18 },
      { id: "v22", sizeMl: 5, price: 849, stock: 9 },
    ],
    reviews: reviews(9),
  },
  {
    id: "10",
    slug: "layton",
    name: "Layton",
    brand: "Parfums de Marly",
    brandSlug: "parfums-de-marly",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 289,
    category: "MENS",
    description:
      "A sweet, refined vanilla-apple opening over a soft lavender heart and warm sandalwood base. Polished and universally flattering.",
    topNotes: ["Apple", "Bergamot", "Lavender"],
    heartNotes: ["Jasmine", "Violet", "Geranium"],
    baseNotes: ["Vanilla", "Sandalwood", "Cardamom"],
    concentration: "Eau de Parfum",
    mainAccords: [
      { name: "Vanilla", intensity: 88 },
      { name: "Aromatic", intensity: 72 },
      { name: "Fruity", intensity: 60 },
      { name: "Woody", intensity: 50 },
      { name: "Warm Spicy", intensity: 35 },
    ],
    isBestSeller: true,
    variants: [
      { id: "v23", sizeMl: 2, price: 499, stock: 24 },
      { id: "v24", sizeMl: 5, price: 999, stock: 14 },
    ],
    reviews: reviews(10),
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.brandSlug === product.brandSlug)
  ).slice(0, limit);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category.toUpperCase());
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.brandSlug === brandSlug);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured);
export const BEST_SELLERS = PRODUCTS.filter((p) => p.isBestSeller);
