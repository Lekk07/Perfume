import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const BRANDS = [
  { name: "Le Labo", slug: "le-labo", description: "Hand-blended, minimalist Brooklyn perfumery." },
  { name: "Maison Francis Kurkdjian", slug: "mfk", description: "Parisian haute perfumery known for radiant, technical compositions." },
  { name: "Tom Ford", slug: "tom-ford", description: "Bold, opulent fragrances from the Private Blend collection." },
  { name: "Dior", slug: "dior", description: "Iconic French maison spanning classic and modern perfumery." },
  { name: "Parfums de Marly", slug: "parfums-de-marly", description: "Equestrian-inspired luxury with a modern French sensibility." },
  { name: "Creed", slug: "creed", description: "Centuries-old house famed for its niche, aristocratic scents." },
  { name: "Amouage", slug: "amouage", description: "Omani luxury perfumery known for opulent, maximalist blends." },
  { name: "Byredo", slug: "byredo", description: "Swedish niche house built on evocative, memory-driven scents." },
];

const PRODUCTS = [
  {
    slug: "santal-33", name: "Santal 33", brandSlug: "le-labo", category: "UNISEX" as const,
    images: ["https://images.unsplash.com/photo-1595425964272-6a5db3d64e7c?q=80&w=1000&auto=format&fit=crop"],
    description: "A smoky, leathery sandalwood built around a rare blend of Australian sandalwood, cardamom, and violet.",
    topNotes: ["Cardamom", "Violet", "Iris"], heartNotes: ["Sandalwood", "Papyrus"], baseNotes: ["Cedarwood", "Amber", "Leather", "Musk"],
    mainAccords: [{ name: "Woody", intensity: 95 }, { name: "Amber", intensity: 78 }, { name: "Leather", intensity: 62 }],
    concentration: "Eau de Parfum", isFeatured: true,
    variants: [{ sizeMl: 2, price: 449, stock: 20 }, { sizeMl: 5, price: 899, stock: 12 }, { sizeMl: 10, price: 1599, stock: 6 }],
  },
  {
    slug: "baccarat-rouge-540", name: "Baccarat Rouge 540", brandSlug: "mfk", category: "NICHE" as const,
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop"],
    description: "An amber-floral signature scent built around saffron and ambergris, radiant and unmistakable on skin.",
    topNotes: ["Saffron", "Jasmine"], heartNotes: ["Amberwood", "Fir Resin"], baseNotes: ["Ambergris", "Cedarwood"],
    mainAccords: [{ name: "Amber", intensity: 96 }, { name: "Sweet", intensity: 80 }, { name: "Floral", intensity: 65 }],
    concentration: "Eau de Parfum", isFeatured: true, isBestSeller: true,
    variants: [{ sizeMl: 2, price: 599, stock: 18 }, { sizeMl: 5, price: 1199, stock: 9 }, { sizeMl: 10, price: 2199, stock: 4 }],
  },
  {
    slug: "sauvage-elixir", name: "Sauvage Elixir", brandSlug: "dior", category: "MENS" as const,
    images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop"],
    description: "A concentrated, spicy-woody take on Sauvage — cinnamon and lavender over a smoky vetiver-tobacco base.",
    topNotes: ["Cinnamon", "Cardamom", "Lavender"], heartNotes: ["Nutmeg", "Star Anise"], baseNotes: ["Tobacco", "Vetiver", "Sandalwood"],
    mainAccords: [{ name: "Warm Spicy", intensity: 92 }, { name: "Woody", intensity: 84 }, { name: "Aromatic", intensity: 70 }],
    concentration: "Parfum", isFeatured: true,
    variants: [{ sizeMl: 2, price: 349, stock: 30 }, { sizeMl: 5, price: 699, stock: 16 }, { sizeMl: 8, price: 1099, stock: 14 }],
  },
  {
    slug: "delina", name: "Delina", brandSlug: "parfums-de-marly", category: "WOMENS" as const,
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop"],
    description: "A modern rose-lychee gourmand with a soft, powdery musk drydown.",
    topNotes: ["Lychee", "Rhubarb", "Bergamot"], heartNotes: ["Turkish Rose", "Peony"], baseNotes: ["Musk", "Cashmeran", "Vanilla"],
    mainAccords: [{ name: "Floral", intensity: 94 }, { name: "Fruity", intensity: 76 }, { name: "Musky", intensity: 68 }],
    concentration: "Eau de Parfum", isFeatured: true, isBestSeller: true,
    variants: [{ sizeMl: 2, price: 449, stock: 22 }, { sizeMl: 5, price: 899, stock: 10 }],
  },
  {
    slug: "oud-wood", name: "Oud Wood", brandSlug: "tom-ford", category: "UNISEX" as const,
    images: ["https://images.unsplash.com/photo-1615368144592-04e0efb9b2ff?q=80&w=1000&auto=format&fit=crop"],
    description: "Smoky rare oud wood softened with rosewood and sandalwood, warmed by amber and vanilla.",
    topNotes: ["Rosewood", "Cardamom"], heartNotes: ["Oud", "Sandalwood"], baseNotes: ["Amber", "Vanilla", "Tonka Bean"],
    mainAccords: [{ name: "Woody", intensity: 97 }, { name: "Oud", intensity: 88 }, { name: "Amber", intensity: 65 }],
    concentration: "Eau de Parfum", isBestSeller: true,
    variants: [{ sizeMl: 2, price: 549, stock: 25 }, { sizeMl: 5, price: 1099, stock: 11 }],
  },
  {
    slug: "aventus", name: "Aventus", brandSlug: "creed", category: "MENS" as const,
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop"],
    description: "The benchmark fruity-smoky men's fragrance — pineapple and blackcurrant over a birch and oakmoss base.",
    topNotes: ["Pineapple", "Blackcurrant", "Bergamot"], heartNotes: ["Birch", "Patchouli", "Jasmine"], baseNotes: ["Oakmoss", "Musk", "Ambergris"],
    mainAccords: [{ name: "Fruity", intensity: 90 }, { name: "Smoky", intensity: 74 }, { name: "Woody", intensity: 68 }],
    concentration: "Eau de Parfum", isBestSeller: true,
    variants: [{ sizeMl: 2, price: 599, stock: 28 }, { sizeMl: 5, price: 1199, stock: 13 }, { sizeMl: 10, price: 2299, stock: 5 }],
  },
  {
    slug: "interlude-man", name: "Interlude Man", brandSlug: "amouage", category: "NICHE" as const,
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop"],
    description: "A dense, incense-heavy oriental built for cold weather — smoke, spice, and leather layered over amber.",
    topNotes: ["Bergamot", "Oregano", "Pepper"], heartNotes: ["Frankincense", "Papyrus"], baseNotes: ["Amber", "Leather", "Styrax"],
    mainAccords: [{ name: "Smoky", intensity: 93 }, { name: "Amber", intensity: 82 }, { name: "Warm Spicy", intensity: 70 }],
    concentration: "Eau de Parfum",
    variants: [{ sizeMl: 2, price: 499, stock: 15 }, { sizeMl: 5, price: 999, stock: 8 }],
  },
  {
    slug: "gypsy-water", name: "Gypsy Water", brandSlug: "byredo", category: "UNISEX" as const,
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop"],
    description: "An airy, bohemian woody-citrus scent — juniper and bergamot over vanilla and sandalwood.",
    topNotes: ["Bergamot", "Lemon", "Pepper"], heartNotes: ["Incense", "Pine Needles", "Orris"], baseNotes: ["Vanilla", "Sandalwood", "Amber"],
    mainAccords: [{ name: "Fresh", intensity: 85 }, { name: "Woody", intensity: 70 }, { name: "Vanilla", intensity: 58 }],
    concentration: "Eau de Parfum",
    variants: [{ sizeMl: 2, price: 399, stock: 20 }, { sizeMl: 5, price: 799, stock: 12 }],
  },
  {
    slug: "another-13", name: "Another 13", brandSlug: "le-labo", category: "UNISEX" as const,
    images: ["https://images.unsplash.com/photo-1615368144592-04e0efb9b2ff?q=80&w=1000&auto=format&fit=crop"],
    description: "A clean, skin-like musk with an ambrette and iso E super base.",
    topNotes: ["Ambrette Seeds", "Bergamot"], heartNotes: ["Musk", "Iso E Super"], baseNotes: ["Amberwood", "Musk"],
    mainAccords: [{ name: "Musky", intensity: 90 }, { name: "Woody", intensity: 66 }, { name: "Fresh", intensity: 55 }],
    concentration: "Eau de Parfum",
    variants: [{ sizeMl: 2, price: 429, stock: 18 }, { sizeMl: 5, price: 849, stock: 9 }],
  },
  {
    slug: "layton", name: "Layton", brandSlug: "parfums-de-marly", category: "MENS" as const,
    images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop"],
    description: "A sweet, refined vanilla-apple opening over a soft lavender heart and warm sandalwood base.",
    topNotes: ["Apple", "Bergamot", "Lavender"], heartNotes: ["Jasmine", "Violet", "Geranium"], baseNotes: ["Vanilla", "Sandalwood", "Cardamom"],
    mainAccords: [{ name: "Vanilla", intensity: 88 }, { name: "Aromatic", intensity: 72 }, { name: "Fruity", intensity: 60 }],
    concentration: "Eau de Parfum", isBestSeller: true,
    variants: [{ sizeMl: 2, price: 499, stock: 24 }, { sizeMl: 5, price: 999, stock: 14 }],
  },
];

const COUPONS = [
  { code: "WELCOME10", description: "10% off for new customers", percentOff: 10 },
  { code: "DECANT15", description: "15% off orders over ₹1000", percentOff: 15, minOrderValue: 1000 },
];

async function main() {
  console.log("Seeding brands...");
  const brandIdBySlug: Record<string, string> = {};
  for (const brand of BRANDS) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name, description: brand.description },
      create: brand,
    });
    brandIdBySlug[brand.slug] = created.id;
  }

  console.log("Seeding products...");
  for (const product of PRODUCTS) {
    const { brandSlug, variants, ...data } = product;
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (existing) {
      console.log(`  Skipping existing product: ${product.name}`);
      continue;
    }
    await prisma.product.create({
      data: {
        ...data,
        brandId: brandIdBySlug[brandSlug],
        variants: { create: variants },
      },
    });
  }

  console.log("Seeding coupons...");
  for (const coupon of COUPONS) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
  }

  console.log("Seeding demo admin account...");
  const adminEmail = "admin@maisonvoile.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin1234!", 10);
    await prisma.user.create({
      data: {
        name: "Maison Voile Admin",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        cart: { create: {} },
      },
    });
    console.log(`  Created admin: ${adminEmail} / Admin1234!  (change this password after first login)`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
