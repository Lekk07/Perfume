import { prisma } from "@/lib/prisma";
import { serializeBrand } from "@/lib/serialize";
import Hero from "@/components/home/Hero";
import BrandStory from "@/components/home/BrandStory";
import ShopByBrand from "@/components/home/ShopByBrand";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const brandsDb = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return { brands: brandsDb.map(serializeBrand) };
}

export default async function HomePage() {
  const { brands } = await getHomeData();

  return (
    <>
      <Hero />
      <BrandStory />
      <ShopByBrand brands={brands} />
      <WhyChooseUs />
    </>
  );
}
