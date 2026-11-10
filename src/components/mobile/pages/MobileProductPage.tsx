"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { mPlayfair, mManrope } from "@/lib/mobile-fonts";
import { FavouritesProvider, useFavourites } from "@/context/favourites-context";
import "@/styles/mobile.css";

type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

type ProductVideo = {
  id: string;
  url: string;
  posterUrl: string | null;
};

type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  style: string | null;
  woodType: string | null;
  finish: string | null;
  dimensions: string | null;
  shortDesc: string | null;
  description: string | null;
  features: string[];
  images: ProductImage[];
  videos: ProductVideo[];
  category: { slug: string; name: string } | null;
  startingPrice: number | null;
  deliveryTime: string | null;
  sizes: string | null;
  finishOptions: string | null;
};

type RelatedItem = {
  slug: string;
  name: string;
  categorySlug: string;
  imageUrl: string | null;
};

type Props = {
  item: ProductDetail;
  related: RelatedItem[];
  settings: { phone: string; whatsapp: string };
};

const TRUST = [
  { icon: "M3 7h12v10H3zM15 10h4l2 3v4h-6M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01", label: "Free delivery" },
  { icon: "M4 4h16v16H4zM9 4v16M15 4v16M4 9h16M4 15h16", label: "Custom sizes" },
  { icon: "M12 2l5 7h-3l4 6h-4l3 5H7l3-5H6l4-6H7z", label: "Handmade" },
];

function sortImages(images: ProductImage[]): ProductImage[] {
  return [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.sortOrder - b.sortOrder;
  });
}

function MobileProductPageInner({ item, related, settings }: Props) {
  const { toggle, isFav } = useFavourites();
  const saved = isFav(item.slug);

  const sortedImages = sortImages(item.images);
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);

  const digits = settings.whatsapp.replace(/\D/g, "");
  const waMessage = `Hello CH FURNITURE,\nI'm interested in the ${item.name}. Please send pricing, available wood options, delivery information and customization options.`;
  const waLink = `https://wa.me/${digits}?text=${encodeURIComponent(waMessage)}`;
  const callLink = `tel:${settings.phone.replace(/\s/g, "")}`;

  const mainImg = sortedImages[activeIdx]?.url ?? null;
  const thumbs = sortedImages.slice(0, 4);

  const tags = [
    item.style,
    item.woodType,
    item.deliveryTime ? `${item.deliveryTime} lead time` : null,
  ].filter(Boolean) as string[];

  const crumb = item.category
    ? `${item.category.name} · made to order`
    : "Made to order";

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: item.name, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); } catch {}
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2800);
    }
  }

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const accordionPanels = [
    {
      key: "materials",
      title: "Materials & Finish",
      body: [
        item.woodType && `Wood: ${item.woodType}`,
        item.finish && `Finish: ${item.finish}`,
        ...(item.features ?? []),
      ].filter(Boolean).join(" · "),
    },
    {
      key: "dimensions",
      title: "Dimensions",
      body: [
        item.dimensions,
        item.sizes && `Available sizes: ${item.sizes}`,
      ].filter(Boolean).join(" · ") || "Custom dimensions available on request.",
    },
    {
      key: "delivery",
      title: "Delivery & Customisation",
      body: [
        item.deliveryTime ? `Lead time: ${item.deliveryTime}.` : "Typical lead time: 4–8 weeks.",
        item.finishOptions ? `Finish options: ${item.finishOptions}.` : "",
        "We deliver across Pakistan and arrange export for international buyers.",
      ].filter(Boolean).join(" "),
    },
  ];

  return (
    <div
      className={`${mPlayfair.variable} ${mManrope.variable}`}
      style={{
        fontFamily: "var(--font-m-body,Manrope,system-ui,sans-serif)",
        background: "#FFFFFF",
        color: "#1A1A1A",
        minHeight: "100vh",
        WebkitFontSmoothing: "antialiased",
        paddingBottom: "110px",
      }}
    >
      {/* Hero image */}
      <div style={{ position: "relative", height: "440px", background: "#F5F3EF" }}>
        <button
          onClick={() => setLightboxOpen(true)}
          aria-label="View photo full screen"
          style={{
            position: "absolute",
            inset: 0,
            border: 0,
            padding: 0,
            background: "transparent",
            cursor: "zoom-in",
            width: "100%",
          }}
        >
          {mainImg && (
            <Image
              src={mainImg}
              alt={sortedImages[activeIdx]?.alt ?? item.name}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", display: "block" }}
            />
          )}
        </button>

        {/* Top overlay controls */}
        <div
          style={{
            position: "absolute",
            left: "12px",
            right: "12px",
            top: "12px",
            display: "flex",
            justifyContent: "space-between",
            pointerEvents: "none",
          }}
        >
          <Link
            href={item.category ? `/category/${item.category.slug}` : "/categories"}
            aria-label="Back to shop"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "22px",
              background: "rgba(255,255,255,.94)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>

          <div style={{ display: "flex", gap: "8px", pointerEvents: "auto" }}>
            <button
              onClick={handleShare}
              aria-label="Share"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "22px",
                border: 0,
                background: "rgba(255,255,255,.94)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
              </svg>
            </button>
            <button
              onClick={() =>
                toggle({
                  id: item.slug,
                  slug: item.slug,
                  categorySlug: item.category?.slug ?? "",
                  name: item.name,
                  image: mainImg ?? "",
                })
              }
              aria-pressed={saved}
              aria-label="Save this piece"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "22px",
                border: 0,
                background: "rgba(255,255,255,.94)",
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
        </div>

        {/* Photo counter */}
        {sortedImages.length > 1 && (
          <span
            style={{
              position: "absolute",
              right: "12px",
              bottom: "12px",
              padding: "5px 10px",
              borderRadius: "12px",
              background: "rgba(26,26,26,.75)",
              color: "#FFFFFF",
              fontSize: "11.5px",
              fontWeight: 700,
            }}
          >
            {activeIdx + 1} / {sortedImages.length}
          </span>
        )}
      </div>

      {/* Thumbnail strip */}
      {thumbs.length > 1 && (
        <div style={{ display: "flex", gap: "8px", padding: "10px 12px 0" }}>
          {thumbs.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(i)}
              aria-pressed={i === activeIdx}
              aria-label={`Photo ${i + 1}`}
              style={{
                flex: 1,
                height: "66px",
                padding: 0,
                borderRadius: "10px",
                overflow: "hidden",
                border: `2px solid ${i === activeIdx ? "#1A1A1A" : "#E8E4DE"}`,
                background: "#F5F3EF",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="calc(25vw - 12px)"
                style={{ objectFit: "cover", display: "block" }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Product info */}
      <section style={{ padding: "18px 16px 0" }}>
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#A64A25",
          }}
        >
          {crumb}
        </p>
        <p
          role="heading"
          aria-level={1}
          style={{
            margin: "6px 0 0",
            fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
            fontWeight: 500,
            fontSize: "30px",
            lineHeight: 1.1,
          }}
        >
          {item.name}
        </p>
        {(item.shortDesc || item.description) ? (
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "14px",
              lineHeight: 1.55,
              color: "#3D3A36",
            }}
          >
            {item.shortDesc || item.description?.slice(0, 180)}
          </p>
        ) : (
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "14px",
              lineHeight: 1.55,
              color: "#3D3A36",
            }}
          >
            The {item.name} is a premium handcrafted{" "}
            {item.category?.name.toLowerCase() ?? "furniture"} by CH Furniture House, built
            from {item.woodType ?? "solid wood"} in our Sialkot workshop. Available in
            custom sizes, finishes, and wood types — contact us on WhatsApp for pricing and
            lead times.
          </p>
        )}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  height: "30px",
                  padding: "0 12px",
                  borderRadius: "15px",
                  background: "#EAF0EB",
                  color: "#23402F",
                  fontSize: "12px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Trust row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          margin: "18px 16px 0",
          borderTop: "1px solid #E8E4DE",
          borderBottom: "1px solid #E8E4DE",
        }}
      >
        {TRUST.map((t, i) => (
          <div
            key={t.label}
            style={{
              padding: "12px 6px",
              textAlign: "center",
              borderLeft: i > 0 ? "1px solid #E8E4DE" : "0",
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
            >
              <path d={t.icon} />
            </svg>
            <div
              style={{
                marginTop: "4px",
                fontSize: "11.5px",
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {t.label}
            </div>
          </div>
        ))}
      </div>

      {/* Make it yours */}
      <section style={{ padding: "22px 16px 0" }}>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
            fontWeight: 500,
            fontSize: "23px",
          }}
        >
          Make it yours
        </h2>

        {item.woodType && (
          <>
            <p
              style={{
                margin: "16px 0 8px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "#5F5A54",
              }}
            >
              Wood ·{" "}
              <span style={{ color: "#1A1A1A" }}>{item.woodType}</span>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <span
                style={{
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "22px",
                  border: "1.5px solid #23402F",
                  background: "#23402F",
                  color: "#FFFFFF",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {item.woodType}
              </span>
              <span
                style={{
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "22px",
                  border: "1.5px solid #E8E4DE",
                  background: "#FFFFFF",
                  color: "#5F5A54",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Other — ask on WhatsApp
              </span>
            </div>
          </>
        )}

        <div
          style={{
            marginTop: "16px",
            padding: "14px 16px",
            borderRadius: "14px",
            background: "#F5F3EF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "13px", color: "#5F5A54" }}>
            Your choice
            <span
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              {item.woodType ?? "Custom — tell us on WhatsApp"}
            </span>
          </span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#23402F", flexShrink: 0 }}>
            Price on WhatsApp
          </span>
        </div>
      </section>

      {/* Accordion */}
      <section style={{ padding: "22px 16px 0" }}>
        <div style={{ borderTop: "1px solid #1A1A1A" }}>
          {accordionPanels.map((panel) => (
            <div key={panel.key} style={{ borderBottom: "1px solid #E8E4DE" }}>
              <button
                onClick={() =>
                  setOpenPanel((prev) => (prev === panel.key ? null : panel.key))
                }
                aria-expanded={openPanel === panel.key}
                style={{
                  width: "100%",
                  minHeight: "54px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: 0,
                  background: "transparent",
                  padding: 0,
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {panel.title}
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 400,
                    transform: openPanel === panel.key ? "rotate(45deg)" : "none",
                    transition: "transform .3s",
                    flexShrink: 0,
                    marginLeft: "8px",
                  }}
                >
                  +
                </span>
              </button>
              {openPanel === panel.key && (
                <p
                  style={{
                    margin: 0,
                    padding: "0 0 14px",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "#3D3A36",
                  }}
                >
                  {panel.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* You may also like */}
      {related.length > 0 && (
        <section style={{ padding: "26px 0 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              padding: "0 16px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                fontWeight: 500,
                fontSize: "23px",
              }}
            >
              You may also like
            </h2>
            {item.category && (
              <Link
                href={`/category/${item.category.slug}`}
                style={{ fontSize: "13px", fontWeight: 700, color: "#A64A25" }}
              >
                See all
              </Link>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              overflowX: "auto",
              padding: "12px 16px 0",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties}
          >
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/category/${r.categorySlug}/${r.slug}`}
                style={{ flexShrink: 0, width: "150px", textDecoration: "none" }}
              >
                <span
                  style={{
                    display: "block",
                    height: "186px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#F5F3EF",
                    position: "relative",
                  }}
                >
                  {r.imageUrl && (
                    <Image
                      src={r.imageUrl}
                      alt={r.name}
                      fill
                      sizes="150px"
                      style={{ objectFit: "cover", display: "block" }}
                    />
                  )}
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: "#1A1A1A",
                  }}
                >
                  {r.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div style={{ height: "10px" }} />

      {/* Fixed bottom bar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
          background: "#FFFFFF",
          borderTop: "1px solid #E8E4DE",
          padding: "10px 14px 16px",
          display: "flex",
          gap: "10px",
          boxShadow: "0 -10px 24px -18px rgba(0,0,0,.4)",
        }}
      >
        <a
          href={callLink}
          aria-label="Call us"
          style={{
            flexShrink: 0,
            width: "54px",
            height: "54px",
            borderRadius: "27px",
            border: "1.5px solid #1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
          </svg>
        </a>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            height: "54px",
            borderRadius: "27px",
            background: "#1B7F45",
            color: "#FFFFFF",
            fontSize: "15px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" />
          </svg>
          Ask price on WhatsApp
        </a>
      </div>

      {/* Share toast */}
      {shareToast && (
        <div
          role="status"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "96px",
            zIndex: 50,
            transform: "translateX(-50%)",
            padding: "10px 16px",
            borderRadius: "20px",
            background: "#1A1A1A",
            color: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          Link copied — share it on WhatsApp
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && mainImg && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full screen photo"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "#0E1611",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: "100%", maxHeight: "80vh" }}>
            <Image
              src={mainImg}
              alt={item.name}
              width={800}
              height={800}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close photo"
            style={{
              position: "absolute",
              right: "14px",
              top: "14px",
              width: "44px",
              height: "44px",
              borderRadius: "22px",
              border: 0,
              background: "rgba(255,255,255,.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export function MobileProductPage(props: Props) {
  return (
    <FavouritesProvider>
      <MobileProductPageInner {...props} />
    </FavouritesProvider>
  );
}
