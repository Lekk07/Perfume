"use client";

import { motion } from "framer-motion";
import type { Accord } from "@/types/product";

// Subtle luxury gradients — gold, bronze, deep olive, sage, champagne, warm brown.
// Champagne is light, so it gets dark ink text; the rest get light text.
const PALETTE = [
  { gradient: "linear-gradient(135deg, #C8A45D 0%, #E8CE9A 100%)", text: "#0F0E0C" },
  { gradient: "linear-gradient(135deg, #9C6B3E 0%, #C9975B 100%)", text: "#F5EEDF" },
  { gradient: "linear-gradient(135deg, #4E4C30 0%, #7D7A4E 100%)", text: "#F1EDDD" },
  { gradient: "linear-gradient(135deg, #667259 0%, #A3B396 100%)", text: "#12140F" },
  { gradient: "linear-gradient(135deg, #E8DCC4 0%, #F3E6C5 100%)", text: "#2A2213" },
  { gradient: "linear-gradient(135deg, #5A3E29 0%, #8B6347 100%)", text: "#F5EEDF" },
];

export default function MainAccords({ accords }: { accords: Accord[] }) {
  if (!accords || accords.length === 0) return null;

  return (
    <div>
      <span className="eyebrow">the composition</span>
      <h2 className="mt-3 mb-6 font-display text-2xl italic text-paper">Main Accords</h2>

      <div className="flex flex-col gap-3">
        {accords.map((accord, i) => {
          const swatch = PALETTE[i % PALETTE.length];
          const width = Math.max(Math.min(accord.intensity, 100), 12);
          return (
            <motion.div
              key={accord.name}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: `${width}%`, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, y: -1 }}
              style={{ background: swatch.gradient }}
              className="flex h-11 min-w-[7rem] max-w-full items-center justify-center rounded-2xl px-5 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.55)] transition-shadow duration-300 hover:shadow-[0_10px_24px_-6px_rgba(200,164,93,0.35)]"
            >
              <span
                style={{ color: swatch.text }}
                className="whitespace-nowrap text-xs font-medium uppercase tracking-label"
              >
                {accord.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
