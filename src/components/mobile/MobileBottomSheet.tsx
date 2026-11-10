"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFavourites } from "@/context/favourites-context";

type Props = {
  type: "saved" | "quote";
  whatsapp: string;
  onClose: () => void;
};

export function MobileBottomSheet({ type, whatsapp, onClose }: Props) {
  const { items, toggle } = useFavourites();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const digits = whatsapp.replace(/\D/g, "");

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 200,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={type === "saved" ? "Saved Pieces" : "Build a Quote"}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#FFFFFF",
          borderRadius: "20px 20px 0 0",
          zIndex: 201,
          maxHeight: "80vh",
          overflowY: "auto",
          animation: "m-sheet-up 0.3s ease",
        }}
      >
        {/* Handle */}
        <div
          style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}
        >
          <div
            style={{
              width: "40px",
              height: "4px",
              borderRadius: "2px",
              background: "#E8E4DE",
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 20px 16px",
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
              fontSize: "20px",
              fontWeight: 600,
              margin: 0,
              color: "#1A1A1A",
            }}
          >
            {type === "saved" ? "Saved Pieces" : "Build a Quote"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Saved sheet */}
        {type === "saved" && (
          <div style={{ padding: "0 16px 24px" }}>
            {items.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 0 40px",
                  color: "#5F5A54",
                }}
              >
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E8E4DE"
                  strokeWidth="1.5"
                  style={{ display: "block", margin: "0 auto 12px" }}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <p style={{ fontSize: "14px", margin: "0 0 4px", fontWeight: 500 }}>
                  No saved pieces yet
                </p>
                <p style={{ fontSize: "12px", color: "#A0998F", margin: 0 }}>
                  Tap the heart on any design to save it
                </p>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{ display: "flex", gap: "12px", alignItems: "center" }}
                  >
                    <Link
                      href={`/category/${item.categorySlug}/${item.slug}`}
                      onClick={onClose}
                      style={{ flexShrink: 0 }}
                    >
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          background: "#F5F3EF",
                          position: "relative",
                        }}
                      >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="64px"
                          />
                        )}
                      </div>
                    </Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link
                        href={`/category/${item.categorySlug}/${item.slug}`}
                        onClick={onClose}
                        style={{ textDecoration: "none" }}
                      >
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#1A1A1A",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </p>
                      </Link>
                    </div>
                    <button
                      onClick={() => toggle(item)}
                      aria-label="Remove from saved"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#A0998F"
                        strokeWidth="2"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* WA quote CTA */}
                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "16px",
                    borderTop: "1px solid #E8E4DE",
                  }}
                >
                  <a
                    href={`https://wa.me/${digits}?text=${encodeURIComponent(
                      `Hello CH Furniture House,\nI'm interested in the following designs:\n${items.map((i) => `- ${i.name}`).join("\n")}\n\nCould you please provide pricing?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: "#1B7F45",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 600,
                      padding: "13px",
                      borderRadius: "25px",
                      textDecoration: "none",
                    }}
                  >
                    Request Quotes on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quote sheet */}
        {type === "quote" && (
          <div
            style={{
              padding: "0 20px 32px",
              textAlign: "center",
              color: "#5F5A54",
            }}
          >
            <p style={{ fontSize: "14px", lineHeight: 1.6, margin: "0 0 20px" }}>
              Collect your favorite pieces and send us a quote request via WhatsApp. We'll reply with pricing, wood options and timelines.
            </p>
            <a
              href={`https://wa.me/${digits}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#1B7F45",
                color: "#fff",
                padding: "13px 24px",
                borderRadius: "25px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Open WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}
