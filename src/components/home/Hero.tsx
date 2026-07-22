"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ScentTrail from "./ScentTrail";

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <ScentTrail className="left-0 top-1/3 h-[220px] w-[130%] -translate-x-10 opacity-70" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:px-10 lg:pt-20">
        {/* Text block */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <span className="eyebrow mb-6">the atelier of decants</span>
          <h1 className="max-w-xl font-display text-[13vw] leading-[0.95] text-paper sm:text-6xl lg:text-7xl">
            Wear it before
            <br />
            you <span className="italic text-gold">own</span> it.
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-mist/80">
            300+ designer and niche perfumes, hand-decanted into 2ml–10ml
            vials. No blind buys, no bottle regret — just the scent, sent to you.
          </p>
          <div className="mt-9 flex items-center justify-center lg:justify-start">
            <Link href="/shop" className="btn-gold">
              Shop Now
            </Link>
          </div>

          <div className="mt-14 flex gap-10 border-t border-black/10 pt-6">
            <div>
              <p className="font-display text-2xl text-paper">300+</p>
              <p className="eyebrow mt-1 text-[10px]">fragrances</p>
            </div>
            <div>
              <p className="font-display text-2xl text-paper">2ml</p>
              <p className="eyebrow mt-1 text-[10px]">starting size</p>
            </div>
            <div>
              <p className="font-display text-2xl text-paper">48h</p>
              <p className="eyebrow mt-1 text-[10px]">dispatch time</p>
            </div>
          </div>
        </motion.div>

        {/* Image block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm pb-10 pl-4 lg:max-w-none"
        >
          <div className="glass-panel absolute inset-0 top-0 rounded-[2rem]" />
          <div className="relative m-6 mb-0 aspect-[3/4] overflow-hidden rounded-[1.5rem]">
            <Image
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop"
              alt="A curated perfume decant vial and bottle, softly lit"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="relative z-10 -mt-8 ml-6 inline-block max-w-[calc(100%-3rem)] rounded-2xl bg-gold px-6 py-4 shadow-gold-glow">
            <p className="font-display text-lg italic text-paper">Decant of the Week</p>
            <p className="text-xs text-paper/70">Santal 33 — 5ml</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
