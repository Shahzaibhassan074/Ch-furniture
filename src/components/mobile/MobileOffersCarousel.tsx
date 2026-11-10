"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OFFERS } from "@/components/mobile/data/offers";

const LOOP = [...OFFERS, ...OFFERS];
const STEP = 246; // 236px card + 10px gap

export function MobileOffersCarousel() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 5), 3600);
    return () => clearInterval(id);
  }, []);

  const isReset = step === 0;
  const translateX = -(step * STEP);

  return (
    <section style={{ padding: "24px 0 0" }}>
      <h2
        style={{
          margin: 0,
          padding: "0 14px",
          fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
          fontWeight: 500,
          fontSize: "26px",
          color: "#1A1A1A",
        }}
      >
        Offers this season
      </h2>
      <div style={{ overflow: "hidden", padding: "12px 0 2px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "max-content",
            paddingLeft: "14px",
            transform: `translateX(${translateX}px)`,
            transition: isReset
              ? "none"
              : "transform .9s cubic-bezier(.65,0,.35,1)",
          }}
        >
          {LOOP.map((deal, i) => {
            const isLight = deal.bg === "#EAF0EB" || deal.bg === "#F8ECE5";
            const ctaColor = isLight ? "rgba(26,26,26,.7)" : "rgba(255,255,255,.75)";
            const isDup = i >= OFFERS.length;
            return (
              <Link
                key={i}
                href={deal.href}
                aria-hidden={isDup || undefined}
                tabIndex={isDup ? -1 : undefined}
                target={deal.href.startsWith("http") ? "_blank" : undefined}
                rel={deal.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  flex: "0 0 236px",
                  height: "150px",
                  borderRadius: "16px",
                  background: deal.bg,
                  color: deal.fg,
                  padding: "16px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textDecoration: "none",
                } as React.CSSProperties}
              >
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    letterSpacing: "1.8px",
                    textTransform: "uppercase",
                    opacity: 0.85,
                  }}
                >
                  {deal.kicker}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                    fontSize: "23px",
                    fontWeight: 600,
                    lineHeight: 1.1,
                    color: deal.fg,
                  }}
                >
                  {deal.title}
                </span>
                <span
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 700,
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                    color: ctaColor,
                  }}
                >
                  {deal.cta} &rsaquo;
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
