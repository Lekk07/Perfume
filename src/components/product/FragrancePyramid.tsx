"use client";

import { motion } from "framer-motion";

function NoteRow({
  label,
  notes,
  delayStart,
}: {
  label: string;
  notes: string[];
  delayStart: number;
}) {
  if (!notes || notes.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
      <span className="eyebrow w-28 shrink-0 pt-1.5 text-[10px]">{label}</span>
      <div className="flex flex-wrap gap-2">
        {notes.map((note, i) => (
          <motion.span
            key={note}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: delayStart + i * 0.06 }}
            className="rounded-full border border-gold/30 bg-gold/[0.06] px-4 py-1.5 text-xs text-gold-light"
          >
            {note}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default function FragrancePyramid({
  topNotes,
  heartNotes,
  baseNotes,
}: {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}) {
  if (
    (!topNotes || topNotes.length === 0) &&
    (!heartNotes || heartNotes.length === 0) &&
    (!baseNotes || baseNotes.length === 0)
  ) {
    return null;
  }

  return (
    <section className="border-t border-black/10 pt-14">
      <div className="mb-8">
        <span className="eyebrow">how it unfolds</span>
        <h2 className="mt-3 text-3xl italic text-paper">Fragrance Pyramid</h2>
      </div>

      <div className="glass-panel flex flex-col gap-6 rounded-2xl p-7">
        <NoteRow label="Top Notes" notes={topNotes} delayStart={0} />
        <NoteRow label="Heart Notes" notes={heartNotes} delayStart={0.15} />
        <NoteRow label="Base Notes" notes={baseNotes} delayStart={0.3} />
      </div>
    </section>
  );
}
