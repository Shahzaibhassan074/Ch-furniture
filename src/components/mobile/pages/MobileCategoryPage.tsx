"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MobileInnerLayout } from "@/components/mobile/MobileInnerLayout";
import { useFavourites } from "@/context/favourites-context";

type FurnitureItem = {
  slug: string;
  name: string;
  style: string | null;
  woodType: string | null;
  shortDesc: string | null;
  categorySlug: string;
  imageUrl: string | null;
  videoUrl: string | null;
};

type Category = {
  slug: string;
  name: string;
  thumbUrl: string | null;
  count: number;
};

type CategoryData = {
  slug: string;
  name: string;
  description: string | null;
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
};

type Props = {
  category: CategoryData;
  furniture: FurnitureItem[];
  categories: Category[];
  settings: Settings;
};

const BADGE_COLORS = ["#A64A25", "#23402F", "#A64A25"];
const STYLES = ["All", "Modern", "Classic", "Traditional", "Luxury", "Hand Carved"];
const PAGE_SIZE = 12;

function ProductCard({
  item,
  whatsapp,
  badgeIdx,
}: {
  item: FurnitureItem;
  whatsapp: string;
  badgeIdx: number;
}) {
  const { toggle, isFav } = useFavourites();
  const saved = isFav(item.slug);
  const digits = whatsapp.replace(/\D/g, "");
  const waLink = `https://wa.me/${digits}?text=${encodeURIComponent(
    `Hello CH FURNITURE,\nI'm interested in the ${item.name} shown on your website. Please provide pricing, available wood options, delivery information, and customization options.`
  )}`;

  return (
    <article>
      <div
        style={{
          position: "relative",
          aspectRatio: "4 / 5",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#F5F3EF",
        }}
      >
        <Link
          href={`/category/${item.categorySlug}/${item.slug}`}
          aria-label={`Open ${item.name}`}
          style={{ position: "absolute", inset: 0, display: "block" }}
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D9D4CC"
                strokeWidth="1.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M5 11V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2M3 12a1.5 1.5 0 0 1 3 0v2h12v-2a1.5 1.5 0 0 1 3 0v4H3z" />
              </svg>
            </div>
          )}
        </Link>

        {item.style && (
          <span
            style={{
              position: "absolute",
              left: "8px",
              top: "8px",
              padding: "4px 9px",
              borderRadius: "10px",
              background: BADGE_COLORS[badgeIdx % BADGE_COLORS.length],
              color: "#FFFFFF",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: ".8px",
              textTransform: "uppercase",
            }}
          >
            {item.style}
          </span>
        )}

        {item.videoUrl && (
          <span
            style={{
              position: "absolute",
              left: "8px",
              bottom: "8px",
              padding: "4px 9px",
              borderRadius: "10px",
              background: "rgba(26,26,26,.85)",
              color: "#FFFFFF",
              fontSize: "10.5px",
              fontWeight: 700,
            }}
          >
            ▶ Video
          </span>
        )}

        <button
          onClick={() =>
            toggle({
              id: item.slug,
              slug: item.slug,
              categorySlug: item.categorySlug,
              name: item.name,
              image: item.imageUrl ?? "",
            })
          }
          aria-pressed={saved}
          aria-label={`Save ${item.name}`}
          style={{
            position: "absolute",
            right: "4px",
            top: "4px",
            width: "40px",
            height: "40px",
            borderRadius: "20px",
            border: 0,
            background: "rgba(255,255,255,.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={saved ? "#B3261E" : "none"}
            stroke={saved ? "#B3261E" : "#1A1A1A"}
            strokeWidth="1.9"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
        </button>
      </div>

      <Link
        href={`/category/${item.categorySlug}/${item.slug}`}
        style={{ display: "block", paddingTop: "8px", textDecoration: "none" }}
      >
        <span
          style={{
            display: "block",
            fontSize: "13.5px",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#1A1A1A",
          }}
        >
          {item.name}
        </span>
        {(item.shortDesc || item.woodType) && (
          <span
            style={{
              display: "block",
              marginTop: "2px",
              fontSize: "12px",
              color: "#5F5A54",
            }}
          >
            {item.shortDesc || item.woodType}
          </span>
        )}
      </Link>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: "8px",
          height: "38px",
          borderRadius: "19px",
          background: "#1B7F45",
          color: "#FFFFFF",
          fontSize: "12.5px",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          textDecoration: "none",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" />
        </svg>
        Ask price
      </a>
    </article>
  );
}

function CategoryChipsRow({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        padding: "2px 12px 10px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      } as React.CSSProperties}
    >
      {categories.map((cat) => {
        const on = cat.slug === activeSlug;
        return (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            aria-current={on ? "page" : undefined}
            style={{
              flexShrink: 0,
              height: "38px",
              padding: "0 14px",
              borderRadius: "19px",
              background: on ? "#1A1A1A" : "#F5F3EF",
              color: on ? "#FFFFFF" : "#1A1A1A",
              fontFamily: "Manrope, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {cat.name}{" "}
            <span style={{ fontSize: "11px", fontWeight: 500, opacity: 0.8 }}>
              {cat.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function MobileCategoryPage({ category, furniture, categories, settings }: Props) {
  const [activeStyle, setActiveStyle] = useState("");
  const [showCount, setShowCount] = useState(PAGE_SIZE);

  const styleSet = new Set(furniture.map((f) => f.style).filter(Boolean) as string[]);
  const availableStyles = STYLES.filter((s) => s === "All" || styleSet.has(s));

  const filtered = activeStyle
    ? furniture.filter((f) => f.style === activeStyle)
    : furniture;
  const visible = filtered.slice(0, showCount);

  const headerExtra = (
    <CategoryChipsRow categories={categories} activeSlug={category.slug} />
  );

  return (
    <MobileInnerLayout
      settings={settings}
      categories={categories}
      backHref="/categories"
      backLabel="Back to collections"
      title={category.name}
      subtitle={`${furniture.length} designs · made to order`}
      headerExtra={headerExtra}
    >
      {/* Style filter */}
      {availableStyles.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 12px 0",
          }}
        >
          <span
            style={{
              flexShrink: 0,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              color: "#5F5A54",
            }}
          >
            Style
          </span>
          <div
            style={{
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties}
          >
            {availableStyles.map((s) => {
              const val = s === "All" ? "" : s;
              const on = activeStyle === val;
              return (
                <button
                  key={s}
                  onClick={() => {
                    setActiveStyle(val);
                    setShowCount(PAGE_SIZE);
                  }}
                  aria-pressed={on}
                  style={{
                    flexShrink: 0,
                    height: "34px",
                    padding: "0 13px",
                    borderRadius: "17px",
                    border: `1.5px solid ${on ? "#23402F" : "#E8E4DE"}`,
                    background: on ? "#23402F" : "#FFFFFF",
                    color: on ? "#FFFFFF" : "#1A1A1A",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Product grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "18px 10px",
          padding: "14px 12px 0",
        }}
      >
        {visible.map((item, i) => (
          <ProductCard
            key={item.slug}
            item={item}
            whatsapp={settings.whatsapp}
            badgeIdx={i}
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div
          style={{
            margin: "14px",
            background: "#F5F3EF",
            borderRadius: "16px",
            padding: "24px 18px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
              fontWeight: 500,
              fontSize: "21px",
            }}
          >
            No {activeStyle} pieces here yet
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "14px",
              lineHeight: 1.5,
              color: "#5F5A54",
            }}
          >
            Show all styles, or ask us to build one to order.
          </p>
          <button
            onClick={() => {
              setActiveStyle("");
              setShowCount(PAGE_SIZE);
            }}
            style={{
              marginTop: "14px",
              height: "46px",
              padding: "0 22px",
              borderRadius: "23px",
              border: 0,
              background: "#1A1A1A",
              color: "#FFFFFF",
              fontFamily: "Manrope, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Show all styles
          </button>
        </div>
      )}

      {/* Load more */}
      {filtered.length > showCount && (
        <div style={{ padding: "22px 14px 0", textAlign: "center" }}>
          <p style={{ margin: "0 0 10px", fontSize: "12.5px", color: "#5F5A54" }}>
            Showing {visible.length} of {filtered.length}
          </p>
          <button
            onClick={() => setShowCount((n) => n + PAGE_SIZE)}
            style={{
              width: "100%",
              height: "50px",
              borderRadius: "25px",
              border: 0,
              background: "#1A1A1A",
              color: "#FFFFFF",
              fontFamily: "Manrope, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Load 12 more
          </button>
        </div>
      )}

      <div style={{ height: "40px" }} />
    </MobileInnerLayout>
  );
}
