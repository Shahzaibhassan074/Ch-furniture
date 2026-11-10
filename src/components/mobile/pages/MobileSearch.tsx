"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { MobileInnerLayout } from "@/components/mobile/MobileInnerLayout";

type Category = {
  slug: string;
  name: string;
  thumbUrl: string | null;
  count: number;
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

type SearchResult = {
  slug: string;
  name: string;
  style: string | null;
  woodType: string | null;
  shortDesc: string | null;
  categorySlug: string;
  imageUrl: string | null;
};

type Props = {
  settings: Settings;
  categories: Category[];
  initialQuery?: string;
};

const POPULAR = ["Sofas", "Dewan", "Beds", "Dining", "Wardrobes", "Carved", "Jhoola", "Chairs"];
const TAG_BG = ["#F5F3EF", "#EAF0EB", "#F8ECE5"];

export function MobileSearch({ settings, categories, initialQuery = "" }: Props) {
  const [q, setQ] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPieces = categories.reduce((s, c) => s + (c.count ?? 0), 0);
  const idle = !q.trim();
  const none = !idle && !loading && results.length === 0;
  const digits = settings.whatsapp.replace(/\D/g, "");

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  const doSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
  }, [doSearch, initialQuery]);

  function handleInput(val: string) {
    setQ(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 320);
  }

  function pickPopular(label: string) {
    const val = label.toLowerCase();
    setQ(label);
    doSearch(val);
    inputRef.current?.focus();
  }

  function clearQ() {
    setQ("");
    setResults([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    inputRef.current?.focus();
  }

  const headerExtra = (
    <div style={{ padding: "0 12px 12px" }}>
      <label
        style={{
          height: "50px",
          borderRadius: "25px",
          background: "#F5F3EF",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 6px 0 16px",
          border: "1.5px solid #1A1A1A",
        }}
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <span
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          Search furniture
        </span>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Sofa, dewan, carved bed…"
          style={{
            flex: 1,
            minWidth: 0,
            height: "46px",
            border: 0,
            background: "transparent",
            fontFamily: "Manrope, sans-serif",
            fontSize: "16px",
            color: "#1A1A1A",
            outline: "none",
          }}
        />
        {q && (
          <button
            onClick={clearQ}
            aria-label="Clear search"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "19px",
              border: 0,
              background: "#1A1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </label>
    </div>
  );

  const rightSlot = (
    <Link
      href="/"
      aria-label="Home"
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "22px",
        border: "1px solid #E8E4DE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
    </Link>
  );

  return (
    <MobileInnerLayout
      settings={settings}
      categories={categories}
      backHref="/"
      backLabel="Back to home"
      title="Search"
      subtitle={`${totalPieces} handcrafted designs`}
      rightSlot={rightSlot}
      headerExtra={headerExtra}
    >
      {/* Idle state */}
      {idle && (
        <>
          <section style={{ padding: "20px 16px 0" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#5F5A54",
              }}
            >
              Popular searches
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
              {POPULAR.map((label, i) => (
                <button
                  key={label}
                  onClick={() => pickPopular(label)}
                  style={{
                    height: "40px",
                    padding: "0 16px",
                    borderRadius: "20px",
                    border: 0,
                    background: TAG_BG[i % TAG_BG.length],
                    color: "#1A1A1A",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section style={{ padding: "24px 16px 0" }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                fontWeight: 500,
                fontSize: "23px",
              }}
            >
              Browse by category
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "10px 8px",
                marginTop: "12px",
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  style={{ display: "block", textAlign: "center", textDecoration: "none" }}
                >
                  <span
                    style={{
                      display: "block",
                      aspectRatio: "1 / 1",
                      borderRadius: "14px",
                      overflow: "hidden",
                      background: "#F5F3EF",
                      position: "relative",
                    }}
                  >
                    {cat.thumbUrl ? (
                      <Image
                        src={cat.thumbUrl}
                        alt={cat.name}
                        fill
                        sizes="calc(33vw - 14px)"
                        style={{ objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                          fontWeight: 700,
                          fontSize: "24px",
                          color: "#23402F",
                        }}
                      >
                        {cat.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      display: "block",
                      marginTop: "6px",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      lineHeight: 1.25,
                      color: "#1A1A1A",
                    }}
                  >
                    {cat.name}
                  </span>
                  <span style={{ display: "block", fontSize: "11px", color: "#5F5A54" }}>
                    {cat.count} designs
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Results */}
      {!idle && !none && (
        <>
          <p
            style={{
              margin: "16px 16px 0",
              fontSize: "12.5px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#A64A25",
            }}
          >
            {loading ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""}`}
          </p>
          <div style={{ display: "flex", flexDirection: "column", padding: "6px 16px 0" }}>
            {results.map((r) => {
              const waLink = `https://wa.me/${digits}?text=${encodeURIComponent(
                `Hello CH FURNITURE,\nI'm interested in the ${r.name} shown on your website. Please provide pricing and customization options.`
              )}`;
              return (
                <div
                  key={r.slug}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderBottom: "1px solid #E8E4DE",
                  }}
                >
                  <Link
                    href={`/category/${r.categorySlug}/${r.slug}`}
                    style={{
                      flexShrink: 0,
                      width: "76px",
                      height: "88px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "#F5F3EF",
                      position: "relative",
                      display: "block",
                    }}
                  >
                    {r.imageUrl && (
                      <Image
                        src={r.imageUrl}
                        alt={r.name}
                        fill
                        sizes="76px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </Link>
                  <Link
                    href={`/category/${r.categorySlug}/${r.slug}`}
                    style={{ flex: 1, minWidth: 0, lineHeight: 1.3, textDecoration: "none" }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#1A1A1A",
                      }}
                    >
                      {r.name}
                    </span>
                    <span
                      style={{
                        display: "block",
                        marginTop: "3px",
                        fontSize: "12px",
                        color: "#5F5A54",
                      }}
                    >
                      {r.shortDesc || r.woodType || r.style || ""}
                    </span>
                  </Link>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ask price for ${r.name} on WhatsApp`}
                    style={{
                      flexShrink: 0,
                      width: "44px",
                      height: "44px",
                      borderRadius: "22px",
                      background: "#1B7F45",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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
                  </a>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* None state */}
      {none && (
        <div
          style={{
            margin: "16px",
            padding: "24px 18px",
            borderRadius: "16px",
            background: "#23402F",
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
              fontWeight: 500,
              fontSize: "22px",
            }}
          >
            Nothing found —{" "}
            <span style={{ fontStyle: "italic", color: "#F2D79B" }}>we can build it</span>
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: 1.5, color: "#C9D6CD" }}>
            Send us a photo or describe the piece on WhatsApp.
          </p>
          <a
            href={`https://wa.me/${digits}?text=${encodeURIComponent(
              `Hello CH FURNITURE, I'm looking for: ${q}. Can you help build or source this?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: "14px",
              height: "50px",
              borderRadius: "25px",
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
              aria-hidden="true"
            >
              <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" />
            </svg>
            Ask us on WhatsApp
          </a>
        </div>
      )}

      <div style={{ height: "40px" }} />
    </MobileInnerLayout>
  );
}
