"use client";

import Image from "next/image";
import Link from "next/link";

type Category = { slug: string; name: string; thumbUrl: string | null };

const TINTS = ["#EAF0EB", "#F8ECE5", "#F5F3EF", "#F5F3EF"];

/*
 * Track layout math for a seamless CSS -50% loop:
 *   Each chip slot = 150px wide + 8px gap = 158px.
 *   Track items: [...categories, ...categories] = 2*N chips.
 *   We need trackWidth = 2*N*158px so that translateX(-50%) = -N*158px,
 *   which puts dup[0] exactly where chip[0] started (seamless).
 *
 *   Flexbox gap gives (2N-1) gaps, so:
 *     2N*150 + (2N-1)*8 = 2N*158 - 8  ← 8px short of 2N*158.
 *   Fix: paddingRight: 8px on the track adds the missing 8px back.
 *
 *   paddingLeft: 12px moves to the outer wrapper (overflow:hidden)
 *   so it doesn't skew the -50% calculation.
 */

export function MobileCategoryChips({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  const loop = [...categories, ...categories];

  return (
    <div
      style={{
        overflow: "hidden",
        paddingTop: "12px",
        paddingBottom: "8px",
        paddingLeft: "12px",
        background: "#FFFFFF",
      }}
    >
      <div
        className="m-chips-track"
        style={{
          display: "flex",
          gap: "8px",
          width: "max-content",
          paddingRight: "8px",
        }}
      >
        {loop.map((cat, i) => {
          const bg = TINTS[i % TINTS.length];
          const src =
            cat.thumbUrl ||
            `https://mutdqybilhpwxhextcbl.supabase.co/storage/v1/object/public/product-images/categories/cat__${cat.slug}_thumb.webp`;
          const isDup = i >= categories.length;
          return (
            <Link
              key={`${cat.slug}-${i}`}
              href={`/category/${cat.slug}`}
              aria-hidden={isDup || undefined}
              tabIndex={isDup ? -1 : undefined}
              style={{
                flex: "0 0 auto",
                width: "150px",
                height: "44px",
                padding: "0 10px 0 4px",
                borderRadius: "22px",
                background: bg,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12.5px",
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textDecoration: "none",
                color: "#1A1A1A",
                boxSizing: "border-box",
              } as React.CSSProperties}
            >
              <span
                className={`m-bob-thumb${i % 2 ? " m-bob-thumb-d" : ""}`}
                style={{
                  display: "block",
                  width: "36px",
                  height: "36px",
                  borderRadius: "18px",
                  background: "#FFFFFF",
                  overflow: "hidden",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <Image src={src} alt={cat.name} fill style={{ objectFit: "cover" }} sizes="36px" />
              </span>
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
