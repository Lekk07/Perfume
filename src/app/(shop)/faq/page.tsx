"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Are these authentic perfumes?",
    a: "Yes. Every decant is hand-poured from an authentic, sealed bottle sourced through authorized retailers. Nothing is diluted or blended.",
  },
  {
    q: "What sizes are available?",
    a: "Most fragrances are available in 2ml, 5ml, 8ml, and 10ml, depending on the perfume. Available sizes are shown on each product page.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders placed before 3pm are dispatched the same or next business day, and typically arrive within 3–6 business days depending on your location.",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes, Cash on Delivery is available at checkout alongside Razorpay for card, UPI, and netbanking payments.",
  },
  {
    q: "Can I return a decant if I don't like the scent?",
    a: "Because decants are opened and used products, we can't accept returns based on scent preference. See our Return Policy for details on damaged or incorrect orders.",
  },
  {
    q: "Will the vials leak in transit?",
    a: "Every vial is sealed with a leak-proof glass atomizer and padded for shipping. If anything arrives damaged, contact us and we'll make it right.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-10">
      <div className="mb-14 flex flex-col items-center text-center">
        <span className="eyebrow">good to know</span>
        <h1 className="mt-3 text-4xl italic text-paper sm:text-5xl">Frequently Asked Questions</h1>
      </div>

      <div className="flex flex-col gap-3">
        {FAQS.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={faq.q} className="glass-panel overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-display text-lg text-paper">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={cn("shrink-0 text-gold transition-transform duration-300", open && "rotate-180")}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-mist/75">{faq.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
