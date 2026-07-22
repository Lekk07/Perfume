import Image from "next/image";
import ScentTrail from "./ScentTrail";

export default function BrandStory() {
  return (
    <section className="relative overflow-hidden py-28">
      <ScentTrail className="left-1/2 top-0 h-[200px] w-[160%] -translate-x-1/2 opacity-40" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[0.85fr_1fr] lg:gap-20 lg:px-10">
        <div className="glass-panel relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop"
            alt="A perfumer's hands decanting fragrance into a glass vial"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-start">
          <span className="eyebrow mb-6">the philosophy</span>
          <h2 className="max-w-md text-4xl italic text-paper sm:text-5xl">
            Every great collection starts with a single, considered decision.
          </h2>
          <p className="mt-7 max-w-md text-base leading-relaxed text-mist/80">
            We believe a signature scent is found, not guessed at. That's why Maison
            Voile exists — to let you live with a fragrance for weeks, not seconds,
            before deciding it's the one. Each vial is hand-filled from an authentic
            bottle, sealed, and sent with the same care as a full bottle purchase.
          </p>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mist/80">
            No guesswork. No blind buys. Just the scent, exactly as its perfumer
            intended, in a size that respects both your curiosity and your budget.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-8 border-t border-black/10 pt-8">
            <div>
              <p className="font-display text-3xl italic text-gold">8</p>
              <p className="eyebrow mt-2 text-[10px]">houses represented</p>
            </div>
            <div>
              <p className="font-display text-3xl italic text-gold">100%</p>
              <p className="eyebrow mt-2 text-[10px]">authentic sourcing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
