import type { Metadata } from "next";
import Image from "next/image";
import ScentTrail from "@/components/home/ScentTrail";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Maison Voile, a considered way to discover perfume.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-32 lg:px-10">
      <div className="relative mb-16 flex flex-col items-center text-center">
        <ScentTrail className="left-1/2 top-0 h-[160px] w-[140%] -translate-x-1/2 opacity-50" />
        <span className="eyebrow relative">our story</span>
        <h1 className="relative mt-3 max-w-2xl text-4xl italic text-paper sm:text-5xl">
          Perfume shouldn't be a gamble.
        </h1>
      </div>

      <div className="glass-panel relative mb-14 aspect-[21/9] w-full overflow-hidden rounded-3xl">
        <Image
          src="https://images.unsplash.com/photo-1615368144592-04e0efb9b2ff?q=80&w=1600&auto=format&fit=crop"
          alt="Perfume decanting workbench with glass vials"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-6 text-sm leading-relaxed text-mist/80">
        <p>
          Maison Voile started from a simple frustration: full bottles cost a small fortune, and
          testers at the counter never tell you how a scent actually wears on your skin over eight
          hours. We wanted a way to properly get to know a fragrance before committing.
        </p>
        <p>
          Every decant we send is drawn from an authentic bottle, sourced through authorized
          retailers, and hand-filled into leak-proof glass atomizers in sizes from 2ml to 10ml.
          Nothing is diluted, nothing is repackaged from unknown sources — what's in the vial is
          exactly what's in the original bottle.
        </p>
        <p>
          Today we carry over 300 fragrances spanning designer houses and independent niche
          perfumers, curated by a small team that actually wears and tests everything we sell.
          Our goal isn't to replace the full bottle — it's to make sure that when you do buy one,
          you already know you'll love it.
        </p>
      </div>
    </div>
  );
}
