"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOBILE_SLIDES } from "@/components/mobile/mobile-slides";

export function MobileHeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setAnimKey((k) => k + 1);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % MOBILE_SLIDES.length);
  }, [current, goTo]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
  }, [next]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 40) {
      dx < 0
        ? goTo((current + 1) % MOBILE_SLIDES.length)
        : goTo((current - 1 + MOBILE_SLIDES.length) % MOBILE_SLIDES.length);
    }
    startTimer();
  };

  const slide = MOBILE_SLIDES[current];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      style={{
        position: "relative",
        height: "488px",
        background: "#23402F",
        overflow: "hidden",
        userSelect: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {MOBILE_SLIDES.map((s, i) => {
        const isActive = i === current;
        return (
          <div
            key={s.id}
            aria-hidden={!isActive}
            style={{
              position: "absolute",
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: "opacity .9s ease",
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <div
              key={isActive ? `kb-${animKey}` : `kb-idle-${s.id}`}
              style={{
                position: "absolute",
                inset: 0,
                animation: isActive ? "m-ken-burns 6s ease-out forwards" : "none",
              }}
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                unoptimized
                style={{ objectFit: "cover", objectPosition: "center top" }}
                priority={i === 0}
                sizes="100vw"
              />
            </div>
            {/* gradient */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg,rgba(14,22,17,.15) 0%,rgba(14,22,17,0) 30%,rgba(14,22,17,.25) 55%,rgba(14,22,17,.82) 100%)",
              }}
            />
          </div>
        );
      })}

      {/* Text overlay — centred at bottom */}
      <div
        style={{
          position: "absolute",
          left: "20px",
          right: "20px",
          bottom: "26px",
          color: "#FFFFFF",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <p
          style={{
            margin: 0,
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: "14px",
            background: "#A64A25",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1.6px",
            textTransform: "uppercase",
            color: "#FFFFFF",
          }}
        >
          {slide.tag}
        </p>
        <h2
          style={{
            margin: "8px 0 0",
            fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
            fontWeight: 500,
            fontSize: "34px",
            lineHeight: 1.08,
          }}
        >
          {slide.t1 ? (
            <>
              {slide.t1}{" "}
              <span style={{ fontStyle: "italic" }}>{slide.t2}</span>
            </>
          ) : (
            <span style={{ fontStyle: "italic" }}>{slide.t2}</span>
          )}
        </h2>
        {slide.sub && (
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "14px",
              lineHeight: 1.5,
              color: "#C9D6CD",
            }}
          >
            {slide.sub}
          </p>
        )}
        <Link
          href={slide.href}
          style={{
            margin: "16px auto 0",
            height: "46px",
            padding: "0 22px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "23px",
            background: "#FFFFFF",
            color: "#1A1A1A",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          {slide.cta} →
        </Link>
      </div>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          display: "flex",
          gap: "6px",
          alignItems: "center",
          paddingBottom: "8px",
        }}
      >
        {MOBILE_SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background:
                i === current ? "#FFFFFF" : "rgba(255,255,255,0.4)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
