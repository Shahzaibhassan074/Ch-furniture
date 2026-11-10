"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CAT_TINTS = ["#EAF0EB", "#F8ECE5", "#F5F3EF"];

const MENU_LINKS = [
  {
    label: "All collections",
    href: "/categories",
    icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  },
  {
    label: "About us",
    href: "/about",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5h.01",
  },
  {
    label: "Visit the workshop",
    href: "/contact",
    icon: "M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  },
  {
    label: "Delivery info",
    href: "/delivery",
    icon: "M3 7h12v10H3zM15 10h4l2 3v4h-6M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01",
  },
];

type Category = {
  slug: string;
  name: string;
  thumbUrl: string | null;
  count: number;
};

type Props = {
  categories: Category[];
  whatsapp: string;
  phone: string;
  onClose: () => void;
};

export function MobileDrawerMenu({ categories, whatsapp, phone, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const openPathname = useRef(pathname);

  // Close when route changes after mount
  useEffect(() => {
    if (pathname !== openPathname.current) onClose();
  }, [pathname, onClose]);

  // Body scroll lock + Esc key
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Move focus to ✕ on open
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const digits = whatsapp.replace(/\D/g, "");
  const waGeneral = `https://wa.me/${digits}?text=${encodeURIComponent(
    "Hello CH FURNITURE, I would like to know more about your furniture."
  )}`;
  const totalPieces = categories.reduce((s, c) => s + (c.count ?? 0), 0);

  return (
    <>
      {/* Backdrop */}
      <button
        onClick={onClose}
        aria-label="Close menu"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          border: 0,
          background: "rgba(14,22,17,.55)",
          cursor: "pointer",
        }}
      />

      {/* Panel */}
      <nav
        aria-label="Main menu"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 201,
          width: "min(334px, 86vw)",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          boxShadow: "12px 0 40px -12px rgba(0,0,0,.35)",
          animation: "m-slide-in 0.28s ease",
        }}
      >
        {/* Forest header */}
        <div
          style={{
            flex: "0 0 auto",
            background: "#23402F",
            color: "#FFFFFF",
            padding: "22px 14px 18px 22px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div style={{ lineHeight: 1 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                  fontWeight: 600,
                  fontSize: "23px",
                  color: "#FFFFFF",
                }}
              >
                CH Furniture House
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: "6px",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "2.6px",
                  textTransform: "uppercase",
                  color: "#D9B877",
                }}
              >
                Handcrafted · Sialkot
              </span>
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close menu"
              style={{
                width: "44px",
                height: "44px",
                marginTop: "-10px",
                borderRadius: "22px",
                border: "1px solid rgba(255,255,255,.25)",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
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
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Search pill */}
          <Link
            href="/search"
            onClick={onClose}
            style={{
              marginTop: "16px",
              height: "44px",
              borderRadius: "22px",
              background: "rgba(255,255,255,.12)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0 16px",
              color: "#C9D6CD",
              fontSize: "13.5px",
              textDecoration: "none",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            Search {totalPieces} pieces
          </Link>
        </div>

        {/* Scroll body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 16px 40px",
          }}
        >
          {/* Shaadi Season bar */}
          <Link
            href="/categories"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "48px",
              padding: "0 16px",
              borderRadius: "14px",
              background: "#A64A25",
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1.6px",
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: "#F2D79B" }} aria-hidden="true">✦</span>
              Shaadi Season
            </span>
            <span style={{ fontSize: "12.5px", fontWeight: 700 }}>
              Jahez packages ›
            </span>
          </Link>

          {/* Shop by category heading */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginTop: "22px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                fontWeight: 500,
                fontSize: "21px",
                color: "#1A1A1A",
              }}
            >
              Shop by category
            </h2>
            <Link
              href="/categories"
              onClick={onClose}
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#A64A25",
                textDecoration: "none",
              }}
            >
              View all
            </Link>
          </div>

          {/* Category grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "8px",
              marginTop: "12px",
            }}
          >
            {categories.map((cat, i) => {
              const tint = CAT_TINTS[i % CAT_TINTS.length];
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    minHeight: "58px",
                    padding: "7px 8px 7px 7px",
                    borderRadius: "14px",
                    background: tint,
                    boxSizing: "border-box",
                    textDecoration: "none",
                  } as React.CSSProperties}
                >
                  <span
                    style={{
                      flex: "0 0 auto",
                      width: "44px",
                      height: "44px",
                      borderRadius: "22px",
                      overflow: "hidden",
                      background: "#FFFFFF",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cat.thumbUrl ? (
                      <Image
                        src={cat.thumbUrl}
                        alt={cat.name}
                        fill
                        sizes="44px"
                        style={{ objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <span
                        style={{
                          fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                          fontWeight: 700,
                          fontSize: "18px",
                          color: "#23402F",
                        }}
                      >
                        {cat.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span style={{ minWidth: 0, lineHeight: 1.2 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#1A1A1A",
                      }}
                    >
                      {cat.name}
                    </span>
                    <span
                      style={{
                        display: "block",
                        marginTop: "2px",
                        fontSize: "11.5px",
                        color: "#5F5A54",
                      }}
                    >
                      {cat.count} designs
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Explore */}
          <h2
            style={{
              margin: "24px 0 4px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#5F5A54",
            }}
          >
            Explore
          </h2>
          {MENU_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                height: "54px",
                borderBottom: "1px solid #E8E4DE",
                color: "#1A1A1A",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  flex: "0 0 auto",
                  width: "36px",
                  height: "36px",
                  borderRadius: "18px",
                  background: "#EAF0EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#23402F"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={link.icon} />
                </svg>
              </span>
              <span style={{ flex: 1, fontSize: "15px", fontWeight: 700 }}>
                {link.label}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5F5A54"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          ))}

          {/* Help box */}
          <div
            style={{
              marginTop: "22px",
              padding: "16px",
              borderRadius: "16px",
              background: "#F5F3EF",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                fontSize: "18px",
                color: "#1A1A1A",
              }}
            >
              Need help choosing?
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "12.5px",
                lineHeight: 1.5,
                color: "#5F5A54",
              }}
            >
              Mon–Sat, 9:00–20:00 ·{" "}
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                style={{ color: "#1A1A1A", fontWeight: 700 }}
              >
                {phone}
              </a>
            </p>
            <a
              href={waGeneral}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "12px",
                height: "46px",
                borderRadius: "23px",
                background: "#1B7F45",
                color: "#FFFFFF",
                fontSize: "13.5px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
