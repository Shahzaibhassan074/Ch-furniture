import Link from "next/link";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";

type FooterProps = {
  brandName:       string;
  tagline:         string;
  address:         string;
  phone:           string;
  whatsapp:        string;
  email:           string;
  whatsappMessage: string;
  social: { facebook?: string; instagram?: string; youtube?: string };
};

const CATEGORIES = [
  { href: "/category/sofas",       label: "Sofas & Lounges" },
  { href: "/category/beds",        label: "Beds & Bedrooms" },
  { href: "/category/dining",      label: "Dining Sets" },
  { href: "/category/chairs",      label: "Chairs" },
  { href: "/category/tables",      label: "Tables" },
  { href: "/category/wardrobes",   label: "Wardrobes" },
  { href: "/category/tv-units",    label: "TV Units" },
  { href: "/category/carved",      label: "Carved Pieces" },
];

export function Footer({
  brandName,
  tagline,
  address,
  phone,
  whatsapp,
  email,
  whatsappMessage,
  social,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone border-t border-inkBorder">
      {/* ── Main grid ── */}
      <div className="container-px grid gap-12 py-16 md:grid-cols-[1.6fr_1fr_1fr_1fr]">

        {/* Col 1: Brand */}
        <div>
          <h3 className="font-display text-2xl font-extrabold text-ink">{brandName}</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-inkMuted">{tagline}</p>
          <a
            href={whatsappUrl(whatsapp, whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-inkBorder bg-parchment px-4 py-2 text-sm font-sans text-ink transition-colors hover:border-terra hover:text-terra"
          >
            <MessageCircle className="h-4 w-4" />
            {phone}
          </a>
          {/* Social */}
          {(social.facebook || social.instagram || social.youtube) && (
            <div className="mt-5 flex gap-2">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-inkBorder text-inkMuted transition-colors hover:border-terra hover:text-terra">
                  <Facebook className="h-3.5 w-3.5" />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-inkBorder text-inkMuted transition-colors hover:border-terra hover:text-terra">
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-inkBorder text-inkMuted transition-colors hover:border-terra hover:text-terra">
                  <Youtube className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Col 2: Categories */}
        <div>
          <p className="eyebrow mb-4">Collections</p>
          <ul className="space-y-2.5">
            <li><Link href="/categories" className="text-sm text-inkMuted hover:text-terra transition-colors">All Collections</Link></li>
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-sm text-inkMuted hover:text-terra transition-colors">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Explore */}
        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2.5">
            {[
              { href: "/",          label: "Home" },
              { href: "/about",     label: "Our Story" },
              { href: "/categories",label: "Collections" },
              { href: "/search",    label: "Search Catalog" },
              { href: "/contact",   label: "Visit the Workshop" },
              { href: "/contact",   label: "Request a Quote" },
            ].map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-inkMuted hover:text-terra transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Workshop info */}
        <div>
          <p className="eyebrow mb-4">Workshop</p>
          <div className="space-y-1 text-sm text-inkMuted">
            <p>{address}</p>
            <p className="pt-2">Mon – Sat</p>
            <p>9:00 — 20:00</p>
            {email && <p className="pt-2">{email}</p>}
            <p className="pt-2">Handcrafted wooden furniture,<br />made to your specifications</p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-inkBorder">
        <div className="container-px flex flex-col items-center justify-between gap-3 py-5 text-xs text-inkMuted sm:flex-row">
          <p>© {year} {brandName}. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-terra transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-terra transition-colors">Terms &amp; Conditions</Link>
            <Link href="/delivery" className="hover:text-terra transition-colors">Delivery &amp; Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
