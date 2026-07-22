"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The brand's signature motion element: a single hand-drawn line that
 * diffuses across a section the way a fragrance disperses in air.
 * Used once per section, never as generic decoration.
 */
export default function ScentTrail({
  className,
  d = "M -50 120 C 150 20, 350 220, 550 90 S 900 40, 1150 140",
  viewBox = "0 0 1100 220",
}: {
  className?: string;
  d?: string;
  viewBox?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute", className)}
      aria-hidden="true"
    >
      <motion.path
        d={d}
        fill="none"
        stroke="url(#trailGradient)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <defs>
        <linearGradient id="trailGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9C7530" stopOpacity="0" />
          <stop offset="45%" stopColor="#9C7530" stopOpacity="0.75" />
          <stop offset="55%" stopColor="#6B4E23" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#9C7530" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
