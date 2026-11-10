import Image from "next/image";
import Link from "next/link";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeroCarousel } from "@/components/mobile/MobileHeroCarousel";
import { MobileProductCard } from "@/components/mobile/MobileProductCard";
import { MobileCategoryChips } from "@/components/mobile/MobileCategoryChips";
import { MobileOffersCarousel } from "@/components/mobile/MobileOffersCarousel";
import { MobileShopTheLook } from "@/components/mobile/MobileShopTheLook";
import { MobileWoodGuide } from "@/components/mobile/MobileWoodGuide";
import { MobileReviews } from "@/components/mobile/MobileReviews";
import { MobileQuoteCTA } from "@/components/mobile/MobileQuoteCTA";
import { MobileFAQ } from "@/components/mobile/MobileFAQ";

type Category = {
  slug: string;
  name: string;
  description: string | null;
  thumbUrl: string | null;
  count: number;
};

type FeaturedItem = {
  slug: string;
  name: string;
  style: string | null;
  woodType: string | null;
  shortDesc: string | null;
  categorySlug: string;
  imageUrl: string | null;
};

type Testimonial = {
  id?: string;
  author: string;
  role?: string | null;
  quote: string;
  rating?: number;
};

type Settings = {
  brandName: string;
  phone: string;
  whatsapp: string;
  address?: string;
  businessHours?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  yearsExperience?: number;
  projectsCompleted?: number;
  happyClients?: number;
};

type Props = {
  settings: Settings;
  categories: Category[];
  featured: FeaturedItem[];
  testimonials: Testimonial[];
};

const TRUST = [
  {
    label: "Solid wood",
    sub: "Sheesham, walnut, teak",
    icon: "M12 2l5 7h-3l4 6h-4l3 5H7l3-5H6l4-6H7z",
    bt: "0",
    bl: "0",
  },
  {
    label: "4–8 weeks",
    sub: "Made to order",
    icon: "M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
    bt: "0",
    bl: "1px solid #E8E4DE",
  },
  {
    label: "All Pakistan",
    sub: "Delivery + export",
    icon: "M3 7h12v10H3zM15 10h4l2 3v4h-6M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01",
    bt: "1px solid #E8E4DE",
    bl: "0",
  },
  {
    label: "Easy payment",
    sub: "EasyPaisa · JazzCash",
    icon: "M3 6h18v12H3zM3 10h18M7 15h3",
    bt: "1px solid #E8E4DE",
    bl: "1px solid #E8E4DE",
  },
];

const ROOM_TINTS = [
  { tint: "#23402F", ink: "#FFFFFF" },
  { tint: "#F8ECE5", ink: "#1A1A1A" },
  { tint: "#EAF0EB", ink: "#1A1A1A" },
  { tint: "#A64A25", ink: "#FFFFFF" },
];

function catDisplayName(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function MobileHome({
  settings,
  categories,
  featured,
  testimonials,
}: Props) {
  const totalPieces = categories.reduce((sum, c) => sum + (c.count ?? 0), 0);

  return (
    <MobileLayout settings={settings} categories={categories}>
      {/* ── Category chips ── */}
      <MobileCategoryChips categories={categories} />

      {/* ── Shaadi Season strip ── */}
      <Link
        href="/categories"
        aria-label="Shaadi Season — shop Jahez packages"
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          height: "32px",
          background: "#A64A25",
          color: "#FFFFFF",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "1.6px",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        <div
          className="m-shine"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "28%",
            background:
              "linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.45),rgba(255,255,255,0))",
            pointerEvents: "none",
          }}
        />
        <span
          className="m-twinkle"
          style={{ display: "inline-block", color: "#F2D79B" }}
          aria-hidden="true"
        >
          &#10022;
        </span>
        <span>Shaadi Season</span>
        <span
          className="m-twinkle-delay"
          style={{ display: "inline-block", color: "#F2D79B" }}
          aria-hidden="true"
        >
          &#10022;
        </span>
        <span
          style={{
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            letterSpacing: ".8px",
          }}
        >
          Shop now &rsaquo;
        </span>
      </Link>

      {/* ── Hero carousel ── */}
      <MobileHeroCarousel />

      {/* ── Trust row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          background: "#EAF0EB",
        }}
      >
        {TRUST.map((t) => (
          <div
            key={t.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              borderTop: t.bt,
              borderLeft: t.bl,
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#23402F"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <path d={t.icon} />
            </svg>
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: 700,
                lineHeight: 1.25,
                color: "#1A1A1A",
              }}
            >
              {t.label}
              <span
                style={{
                  display: "block",
                  fontWeight: 500,
                  color: "#3E5546",
                }}
              >
                {t.sub}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* ── Offers this season ── */}
      <MobileOffersCarousel />

      {/* ── Shop the Look ── */}
      <MobileShopTheLook />

      {/* ── Best sellers ── */}
      {featured.length > 0 && (
        <section style={{ padding: "30px 14px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                fontWeight: 500,
                fontSize: "26px",
                color: "#1A1A1A",
              }}
            >
              Best sellers
            </h2>
            <Link
              href="/categories"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#A64A25",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Shop all {totalPieces}
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "16px 10px",
              marginTop: "14px",
            }}
          >
            {featured.map((item, i) => {
              const meta = `${catDisplayName(item.categorySlug)}${
                item.woodType
                  ? " · " + item.woodType
                  : item.style
                  ? " · " + item.style
                  : ""
              }`;
              return (
                <MobileProductCard
                  key={item.slug}
                  slug={item.slug}
                  name={item.name}
                  meta={meta}
                  categorySlug={item.categorySlug}
                  imageUrl={item.imageUrl}
                  index={i}
                  whatsapp={settings.whatsapp}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ── Shop by room ── */}
      {categories.length > 0 && (
        <section style={{ padding: "34px 0 0" }}>
          <div style={{ padding: "0 14px" }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                fontWeight: 500,
                fontSize: "26px",
                color: "#1A1A1A",
              }}
            >
              Shop by room
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "10px",
              marginTop: "14px",
              padding: "0 14px",
            }}
          >
            {categories.slice(0, 4).map((cat, i) => {
              const { tint, ink } = ROOM_TINTS[i];
              const thumb =
                cat.thumbUrl ||
                `https://mutdqybilhpwxhextcbl.supabase.co/storage/v1/object/public/product-images/categories/cat__${cat.slug}_thumb.webp`;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  style={{
                    display: "block",
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: tint,
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      height: "150px",
                      background: "#F5F3EF",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={thumb}
                      alt={cat.name}
                      fill
                      style={{ objectFit: "cover", display: "block" }}
                      sizes="(max-width: 767px) 45vw"
                    />
                  </span>
                  <span
                    style={{ display: "block", padding: "12px 12px 14px" }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontFamily:
                          'var(--font-m-display,"Playfair Display",serif)',
                        fontWeight: 600,
                        fontSize: "19px",
                        color: ink,
                      }}
                    >
                      {cat.name}
                    </span>
                    <span
                      style={{
                        display: "block",
                        marginTop: "3px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: ink,
                        opacity: 0.8,
                      }}
                    >
                      {cat.count} designs &rsaquo;
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
          <Link
            href="/categories"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "14px 14px 0",
              height: "50px",
              borderRadius: "25px",
              background: "#1A1A1A",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            View all {categories.length} collections
          </Link>
        </section>
      )}

      {/* ── Quote CTA + sheet ── */}
      <MobileQuoteCTA />

      {/* ── Wood guide ── */}
      <MobileWoodGuide />

      {/* ── Reviews (hidden when empty) ── */}
      <MobileReviews testimonials={testimonials} />

      {/* ── FAQ ── */}
      <MobileFAQ />

      {/* bottom spacing */}
      <div style={{ height: "40px" }} />
    </MobileLayout>
  );
}
