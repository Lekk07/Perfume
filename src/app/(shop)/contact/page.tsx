"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-32 lg:px-10">
      <div className="mb-14 flex flex-col items-center text-center">
        <span className="eyebrow">get in touch</span>
        <h1 className="mt-3 text-4xl italic text-paper sm:text-5xl">Contact Us</h1>
        <p className="mt-4 max-w-md text-sm text-mist/70">
          Questions about an order, a fragrance, or a bulk request — we usually reply within a
          business day.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          {[
            { icon: Mail, label: "Email", value: "hello@maisonvoile.com" },
            { icon: Phone, label: "Phone", value: "+91 98765 43210" },
            { icon: MapPin, label: "Studio", value: "Bengaluru, Karnataka, India" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-panel flex items-center gap-4 rounded-2xl p-5">
              <div className="rounded-full border border-gold/30 p-2.5 text-gold">
                <Icon size={16} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-label text-mist/60">{label}</p>
                <p className="text-sm text-paper">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-2xl p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <p className="font-display text-2xl italic text-paper">Message sent.</p>
              <p className="text-sm text-mist/70">We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  className="rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
                />
                <input
                  required
                  type="email"
                  placeholder="Your email"
                  className="rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
              />
              <textarea
                required
                rows={5}
                placeholder="Your message"
                className="resize-none rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
              />
              <button type="submit" className="btn-gold self-start">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
