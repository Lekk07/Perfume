import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Perfumes", href: "/shop" },
      { label: "Designer", href: "/collections/designer" },
      { label: "Niche", href: "/collections/niche" },
      { label: "Gift Sets", href: "/shop?tag=gift" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Policy", href: "/policies/shipping" },
      { label: "Return Policy", href: "/policies/returns" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Maison Voile", href: "/about" },
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms & Conditions", href: "/policies/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-ink-raised">
      {/* Newsletter */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="glass-panel flex flex-col items-center gap-6 rounded-3xl px-8 py-12 text-center sm:px-16">
          <span className="eyebrow">stay in the fold</span>
          <h3 className="max-w-lg text-3xl italic text-paper sm:text-4xl">
            New arrivals, decant-only releases, and scent notes — monthly.
          </h3>
          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 rounded-full border border-black/15 bg-transparent px-5 py-3 text-sm text-paper placeholder:text-mist/50 focus:border-gold focus:outline-none"
            />
            <button type="submit" className="btn-gold shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Link grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 pb-16 lg:grid-cols-5 lg:px-10">
        <div className="col-span-2 flex flex-col gap-4">
          <span className="font-display text-2xl italic text-paper">Maison Voile</span>
          <p className="max-w-xs text-sm leading-relaxed text-mist/70">
            Considered decants of the world&apos;s most celebrated perfumes —
            so you can find your signature scent before committing to a full bottle.
          </p>
          <div className="flex gap-3 pt-2">
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full border border-black/15 p-2.5 text-paper transition-colors hover:border-gold hover:text-gold"
            >
              <Instagram size={16} strokeWidth={1.5} />
            </a>
            <a
              href="mailto:hello@maisonvoile.com"
              aria-label="Email"
              className="rounded-full border border-black/15 p-2.5 text-paper transition-colors hover:border-gold hover:text-gold"
            >
              <Mail size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-4">
            <span className="eyebrow">{col.title}</span>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-mist/80 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-black/[0.06] px-6 py-6 lg:px-10">
        <p className="text-center text-xs text-mist/40">
          © {new Date().getFullYear()} Maison Voile. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
