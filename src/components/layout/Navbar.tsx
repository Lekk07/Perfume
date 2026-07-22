"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Designer", href: "/collections/designer" },
  { label: "Niche", href: "/collections/niche" },
  { label: "Women's", href: "/collections/womens" },
  { label: "Men's", href: "/collections/mens" },
  { label: "Brands", href: "/brands" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mounted, setMounted] = useState(false);

  const cartCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const isAuthenticated = useAuthStore((s) => s.status === "authenticated");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue("");
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "border-b border-black/[0.06] bg-ink/85 backdrop-blur-glass"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Mobile menu trigger */}
        <button
          className="p-2 text-paper lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>

        {/* Wordmark */}
        <Link href="/" className="group flex flex-col items-center lg:items-start">
          <span className="font-display text-2xl italic tracking-wide text-paper">
            Maison Voile
          </span>
          <span className="eyebrow hidden lg:block">fragrance decants</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-[13px] uppercase tracking-label text-mist transition-colors duration-300 hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Search"
            className="rounded-full p-2.5 text-paper transition-colors hover:text-gold"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={19} strokeWidth={1.5} />
          </button>
          <Link
            href={mounted && isAuthenticated ? "/profile" : "/login"}
            aria-label="Account"
            className="relative hidden rounded-full p-2.5 text-paper transition-colors hover:text-gold sm:block"
          >
            <User size={19} strokeWidth={1.5} className={mounted && isAuthenticated ? "text-gold" : ""} />
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative rounded-full p-2.5 text-paper transition-colors hover:text-gold"
          >
            <Heart size={19} strokeWidth={1.5} />
            {mounted && wishlistCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-paper">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2.5 text-paper transition-colors hover:text-gold"
          >
            <ShoppingBag size={19} strokeWidth={1.5} />
            {mounted && cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-paper">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-glass"
          >
            <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-32">
              <button
                className="absolute right-6 top-8 p-2 text-paper hover:text-gold"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <X size={24} strokeWidth={1.5} />
              </button>
              <span className="eyebrow mb-4">search the atelier</span>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search by perfume or brand…"
                  className="w-full border-b border-black/20 bg-transparent pb-4 text-center font-display text-3xl italic text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-[60] flex w-[85%] max-w-sm flex-col bg-ink-raised p-8"
          >
            <button
              className="mb-10 self-end p-2 text-paper hover:text-gold"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <X size={22} strokeWidth={1.5} />
            </button>
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-2xl italic text-paper hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={mounted && isAuthenticated ? "/profile" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl italic text-paper hover:text-gold"
              >
                {mounted && isAuthenticated ? "My Account" : "Sign In"}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
