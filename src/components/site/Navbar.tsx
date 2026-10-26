"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CHLogo } from "@/components/site/CHLogo";
import { useEffect, useRef, useState } from "react";
import {
  Menu, X, Search, MessageCircle, CheckCircle,
  Phone, ChevronDown, ArrowRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type NavCategory = {
  slug:         string;
  name:         string;
  count:        number;
  thumbUrl?:    string | null;
  description?: string | null;
};

const OTHER_NAV = [
  { href: "/search",  label: "Search"   },
  { href: "/about",   label: "About"    },
  { href: "/contact", label: "Workshop" },
];

type NavbarProps = {
  brandName?:  string;
  address?:    string;
  phone?:      string;
  hours?:      string;
  whatsapp?:   string;
  categories?: NavCategory[];
};

export function Navbar({
  brandName  = "CH Furniture House",
  address    = "Mohala Sardaaran, Pasrur, Sialkot",
  phone      = "+92 341 630 9652",
  hours      = "Mon–Sat  9:00 — 20:00",
  whatsapp   = "923416309652",
  categories = [],
}: NavbarProps) {
  const pathname     = usePathname();
  const [mounted,    setMounted]    = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen,   setMegaOpen]   = useState(false);
  const [featured,   setFeatured]   = useState<NavCategory | null>(categories[0] ?? null);
  const menuRef = useRef<HTMLDivElement>(null);

  const totalPieces = categories.reduce((s, c) => s + c.count, 0);

  const collectionsActive =
    pathname === "/categories" || pathname.startsWith("/category/");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close both menus on route change */
  useEffect(() => { setMobileOpen(false); setMegaOpen(false); }, [pathname]);

  /* close mega menu on click-outside */
  useEffect(() => {
    if (!megaOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [megaOpen]);

  const collectionsPill = megaOpen || collectionsActive;

  return (
    <header ref={menuRef} className="fixed inset-x-0 top-0 z-40">

      {/* ── Announcement bar ── */}
      <div className="border-b border-inkBorder bg-parchment">
        <div className="container-px flex h-8 items-center justify-between gap-4 text-[11px] font-sans text-inkMuted">
          <span className="flex shrink-0 items-center gap-1.5">
            <CheckCircle className="h-3 w-3 text-terra" />
            <span>Verified official site</span>
            <span className="mx-0.5 text-inkBorder">—</span>
            <span className="font-medium text-terra">chfurniturehouse.com</span>
          </span>
          <span className="hidden truncate md:block">
            {address}&nbsp;·&nbsp;{hours}
          </span>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex shrink-0 items-center gap-1.5 transition-colors hover:text-ink"
          >
            <Phone className="h-3 w-3" />
            {phone}
          </a>
        </div>
      </div>

      {/* ── Main nav ── */}
      <div className={cn(
        "border-b border-inkBorder bg-cream transition-shadow duration-300",
        scrolled && "shadow-sm",
      )}>
        <nav className="container-px flex h-[60px] items-center gap-6">

          {/* Logo — plain div on SSR, animated on client after mount */}
          <div>
            <Link href="/" aria-label={brandName} className="flex shrink-0 items-center mr-4">
              <CHLogo className="h-8 w-auto sm:h-10" />
            </Link>
          </div>

          {/* Desktop nav */}
          <ul className="hidden flex-1 items-center justify-center gap-0.5 md:flex">

            {/* Collections — mega menu trigger */}
            <li className="relative">
              <button
                onClick={() => setMegaOpen((v) => !v)}
                className={cn(
                  "relative flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-sans font-medium transition-colors duration-200",
                  collectionsPill ? "text-terra" : "text-inkMuted hover:text-ink",
                )}
              >
                {mounted && collectionsPill && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-blush"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  Collections
                  <motion.span
                    animate={{ rotate: megaOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </motion.span>
                </span>
              </button>
            </li>

            {/* Other links */}
            {OTHER_NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "relative block rounded-full px-4 py-2 text-[13px] font-sans font-medium transition-colors duration-200",
                      active ? "text-terra" : "text-inkMuted hover:text-ink",
                    )}
                  >
                    {mounted && active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-blush"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right: search + WhatsApp */}
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Link
              href="/search"
              className="flex h-9 items-center gap-2.5 rounded-full border border-inkBorder bg-cream px-4 text-[12px] font-sans text-inkMuted transition-colors hover:border-ink/30 hover:text-ink"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span>Search pieces…</span>
              <span className="ml-2 rounded border border-inkBorder bg-stone px-1.5 py-0.5 text-[10px] font-mono leading-none text-inkMuted">
                ⌘K
              </span>
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-terra h-9 px-5 text-[13px]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-inkBorder text-ink md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* ── Mega menu dropdown ── */}
      <AnimatePresence>
        {megaOpen && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-inkBorder bg-cream shadow-xl md:block hidden"
          >
            <div className="container-px py-6">
              {/* Header row */}
              <div className="mb-5 flex items-center justify-between border-b border-inkBorder pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-sans font-medium uppercase tracking-widest2 text-inkMuted">
                    The Collection
                  </span>
                  <span className="h-3.5 w-px bg-inkBorder" />
                  <span className="text-[11px] font-sans text-inkMuted">
                    {categories.length} categories · {totalPieces} pieces
                  </span>
                </div>
                <Link
                  href="/categories"
                  onClick={() => setMegaOpen(false)}
                  className="flex items-center gap-1.5 text-[12px] font-sans font-medium text-inkMuted hover:text-terra transition-colors"
                >
                  Browse all {categories.length} collections
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Body: list + featured card */}
              <div className="grid grid-cols-[1fr_260px] gap-8 lg:grid-cols-[1fr_300px]">

                {/* Category grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-0 lg:grid-cols-3">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setMegaOpen(false)}
                      onMouseEnter={() => setFeatured(cat)}
                      className="group flex items-center justify-between border-b border-inkBorder/50 py-3 transition-colors hover:text-terra"
                    >
                      <span className="font-sans text-[13px] font-medium text-ink group-hover:text-terra transition-colors">
                        {cat.name}
                      </span>
                      <span className="ml-3 font-sans text-[11px] text-inkMuted group-hover:text-terra/70 transition-colors">
                        {cat.count}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Featured card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featured?.slug ?? "none"}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="relative overflow-hidden rounded-2xl bg-stone"
                  >
                    {featured?.thumbUrl ? (
                      <>
                        <Image
                          src={featured.thumbUrl}
                          alt={featured.name}
                          fill
                          className="object-cover"
                          sizes="300px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                      </>
                    ) : (
                      <div className="h-full min-h-[200px] bg-inkSubtle" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[9px] font-sans font-medium uppercase tracking-widest2 text-white/50">
                        Most asked for
                      </p>
                      <p className="mt-1 font-display text-xl font-bold text-white">
                        {featured?.name}
                      </p>
                      {featured?.description && (
                        <p className="mt-1 line-clamp-2 text-[11px] text-white/70">
                          {featured.description}
                        </p>
                      )}
                      <Link
                        href={`/category/${featured?.slug}`}
                        onClick={() => setMegaOpen(false)}
                        className="mt-3 flex items-center gap-1.5 text-[12px] font-sans font-medium text-white/80 hover:text-white transition-colors"
                      >
                        View {featured?.count} pieces <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-b border-inkBorder bg-cream shadow-lg md:hidden"
          >
            <ul className="container-px flex flex-col gap-1 py-4">
              <li>
                <Link
                  href="/categories"
                  className={cn(
                    "block rounded-xl px-4 py-3 font-display text-lg font-semibold transition-colors",
                    collectionsActive ? "bg-blush text-terra" : "text-ink hover:bg-inkSubtle",
                  )}
                >
                  Collections
                </Link>
                {/* Mobile sub-list */}
                {categories.length > 0 && (
                  <div className="ml-4 mt-1 border-l border-inkBorder pl-4">
                    {categories.slice(0, 6).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between py-2 text-[13px] font-sans text-inkMuted hover:text-terra transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[11px]">{cat.count}</span>
                      </Link>
                    ))}
                    {categories.length > 6 && (
                      <Link
                        href="/categories"
                        className="mt-1 flex items-center gap-1 py-2 text-[12px] font-sans font-medium text-terra"
                      >
                        All {categories.length} collections <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                )}
              </li>
              {OTHER_NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-xl px-4 py-3 font-display text-lg font-semibold transition-colors",
                        active ? "bg-blush text-terra" : "text-ink hover:bg-inkSubtle",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-3">
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-terra px-5 py-3 text-sm font-sans font-medium text-white"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
