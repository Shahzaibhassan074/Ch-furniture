"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PRODUCT = {
  slug: "ivory-arch-headboard-king-bed",
  name: "Ivory Arch Headboard King Bed",
  image:
    "https://res.cloudinary.com/wlcd3y9y/image/upload/v1793530597/ch-furniture/uhwcwurxnnhglojsdjzz.jpg",
  categorySlug: "beds",
  label: "Beds · Modern",
  sub: "Sheesham · made to order",
};

export function MobileShopTheLook() {
  const [open, setOpen] = useState(true);

  return (
    <section style={{ padding: "26px 14px 0" }}>
      <p
        style={{
          margin: 0,
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "2.2px",
          textTransform: "uppercase",
          color: "#A64A25",
        }}
      >
        Shop the look
      </p>
      <h2
        style={{
          margin: "6px 0 0",
          fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
          fontWeight: 500,
          fontSize: "28px",
          lineHeight: 1.1,
          color: "#1A1A1A",
        }}
      >
        A bedroom built <span style={{ fontStyle: "italic" }}>to last</span>
      </h2>

      <div
        style={{
          position: "relative",
          marginTop: "14px",
          height: "300px",
          borderRadius: "16px",
          overflow: "hidden",
          background: "#F5F3EF",
        }}
      >
        <Image
          src={PRODUCT.image}
          alt="Arched ivory headboard bed on a sheesham frame in a calm bedroom"
          fill
          style={{ objectFit: "cover", display: "block" }}
          sizes="(max-width: 767px) calc(100vw - 28px)"
        />

        {/* Hotspot pin */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Show product in this photo"
          className="m-pulse-btn"
          style={{
            position: "absolute",
            left: "52%",
            top: "52%",
            width: "30px",
            height: "30px",
            borderRadius: "15px",
            border: "2px solid #FFFFFF",
            background: "rgba(30,22,17,.55)",
            color: "#FFFFFF",
            fontSize: "18px",
            lineHeight: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </button>

        {/* Product card */}
        {open && (
          <Link
            href={`/category/${PRODUCT.categorySlug}/${PRODUCT.slug}`}
            style={{
              position: "absolute",
              left: "12px",
              right: "12px",
              bottom: "12px",
              background: "#FFFFFF",
              padding: "12px 12px 12px 14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 8px 20px -10px rgba(0,0,0,.5)",
              textDecoration: "none",
              animation: "m-fade .4s ease both",
            }}
          >
            <span style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  color: "#A64A25",
                }}
              >
                {PRODUCT.label}
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: "2px",
                  fontSize: "14.5px",
                  fontWeight: 700,
                  color: "#1A1A1A",
                }}
              >
                {PRODUCT.name}
              </span>
              <span
                style={{ display: "block", fontSize: "12px", color: "#5F5A54" }}
              >
                {PRODUCT.sub}
              </span>
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
}
