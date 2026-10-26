"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SLIDES } from "./slides";

const DURATION = 3500;

const imgVariants = {
  enter  : { opacity: 0, scale: 1.04 },
  center : { opacity: 1, scale: 1,    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit   : { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } },
};

const textContainer = {
  hidden: {},
  show  : { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  exit  : { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const textItem = {
  hidden: { opacity: 0, y: 20, filter: "blur(3px)" },
  show  : { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit  : { opacity: 0, y: -8, filter: "blur(1px)",  transition: { duration: 0.25 } },
};

const bigNumVariants = {
  enter  : { opacity: 0, x: 60 },
  center : { opacity: 1, x: 0,   transition: { duration: 1, ease: "easeOut" } },
  exit   : { opacity: 0, x: -40, transition: { duration: 0.5 } },
};

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const touchX = useRef(0);

  const goTo = useCallback((i: number) => {
    setCurrent(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, DURATION);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide      = SLIDES[current];
  const numLabel   = String(current + 1).padStart(2, "0");
  const totalLabel = String(SLIDES.length).padStart(2, "0");

  return (
    <section
      className="relative flex h-screen flex-col overflow-hidden"
      style={{ paddingTop: 96 }}
      aria-label="Hero"
    >
      {/* ── Announcement bar ── */}
      <div className="relative z-30 flex shrink-0 items-center justify-center gap-2.5 bg-terra px-4 py-2 text-white sm:gap-3 sm:py-2.5">
        <span className="font-sans text-[11px] font-medium leading-tight sm:text-sm">
          <span className="sm:hidden">Jahez packages — wedding season sale!</span>
          <span className="hidden sm:inline">Save more this wedding season — Jahez packages available now!</span>
        </span>
        <Link href="/categories" className="btn-ghost-white shrink-0 whitespace-nowrap !py-1 !px-3 !text-[11px] sm:!text-xs">
          Shop Now
        </Link>
      </div>

      {/* ── Slider stage ── */}
      <div
        className="relative flex-1 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const d = touchX.current - e.changedTouches[0].clientX;
          if (Math.abs(d) > 48) d > 0 ? next() : prev();
        }}
      >
        {/* ── Background image ── */}
        <div
          className="absolute inset-0"
          style={{ background: slide.bgColor ?? "#0A0806" }}
        />
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${current}`}
            variants={imgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Mobile image — shown only below sm, when a mobileImage is provided */}
            {slide.mobileImage && (
              <Image
                src={slide.mobileImage}
                alt={slide.title}
                fill
                quality={85}
                priority={current === 0}
                sizes="100vw"
                className={`sm:hidden ${slide.mobileObjectFit === "contain" ? "object-contain" : "object-cover"}`}
                style={{ objectPosition: slide.mobileObjectPosition ?? "center center" }}
              />
            )}
            {/* Desktop image — always shown; hidden on mobile when mobileImage exists */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              quality={90}
              priority={current === 0}
              sizes={slide.mobileImage ? "(max-width: 639px) 1px, 100vw" : "100vw"}
              className={`${slide.mobileImage ? "hidden sm:block" : ""} ${slide.objectFit === "contain" ? "object-contain" : "object-cover"}`}
              style={{ objectPosition: slide.objectPosition ?? "center center" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* ── Gradient overlays ── */}
        {!slide.noTextOverlay && (
          <>
            {/* Desktop: left-to-right */}
            <div
              className="pointer-events-none absolute inset-0 z-10 hidden sm:block"
              style={{ background: "linear-gradient(105deg, rgba(10,8,6,0.90) 0%, rgba(10,8,6,0.58) 38%, rgba(10,8,6,0.12) 62%, transparent 80%)" }}
            />
            {/* Mobile: bottom-to-top */}
            <div
              className="pointer-events-none absolute inset-0 z-10 sm:hidden"
              style={{ background: "linear-gradient(to top, rgba(10,8,6,0.97) 0%, rgba(10,8,6,0.80) 30%, rgba(10,8,6,0.40) 58%, rgba(10,8,6,0.05) 80%, transparent 100%)" }}
            />
            {/* Edge vignette — both */}
            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{ background: "radial-gradient(ellipse 130% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.28) 100%)" }}
            />
          </>
        )}

        {/* ── Decorative slide number (desktop only) ── */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`bignum-${current}`}
            variants={bigNumVariants}
            initial="enter"
            animate="center"
            exit="exit"
            aria-hidden
            className="pointer-events-none absolute right-[4%] top-[8%] z-10 hidden select-none font-display font-black leading-none text-white/[0.055] sm:block"
            style={{ fontSize: "clamp(9rem, 20vw, 18rem)" }}
          >
            {numLabel}
          </motion.span>
        </AnimatePresence>

        {/* ── Slide content ── */}
        {slide.noTextOverlay ? (

          <div className="absolute inset-x-0 bottom-20 z-20 flex justify-center">
            <Link href={slide.ctaLink} className="btn-terra px-8 py-3.5 shadow-xl shadow-black/30">
              {slide.ctaText}
            </Link>
          </div>

        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              variants={textContainer}
              initial="hidden"
              animate="show"
              exit="exit"
              className={[
                "absolute z-20 flex flex-col",
                // Mobile: bottom-anchored, full width
                "bottom-[88px] left-0 right-0 px-6",
                // Desktop: left-aligned, vertically centred
                "sm:bottom-auto sm:right-auto sm:top-1/2 sm:-translate-y-1/2",
                "sm:left-[7%] sm:max-w-[54%] sm:px-0",
                "lg:left-[8%] lg:max-w-[48%]",
              ].join(" ")}
            >
              {/* Brand H1 — always the first line; consistent across all slides */}
              <motion.h1
                variants={textItem}
                className="mb-4 flex items-center gap-3 sm:mb-5"
              >
                <span className="h-px w-6 flex-shrink-0 bg-terra/60" />
                <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.32em] text-terra/80 sm:text-[10px]">
                  CH Furniture House · Handcrafted Solid Wood · Sialkot
                </span>
              </motion.h1>

              {/* Eyebrow */}
              {slide.eyebrow && (
                <motion.div variants={textItem} className="mb-4 flex items-center gap-3 sm:mb-5">
                  <span className="h-px w-8 flex-shrink-0 bg-terra sm:w-10" />
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-terra">
                    {slide.eyebrow}
                  </span>
                </motion.div>
              )}

              {/* Title — h2 (H1 is the brand eyebrow above) */}
              <motion.h2
                variants={textItem}
                className="font-display font-black leading-[0.92] tracking-tight text-white [font-size:clamp(2rem,8vw,5.8rem)] sm:[font-size:clamp(2.5rem,6.5vw,5.8rem)]"
              >
                {slide.title}
              </motion.h2>

              {/* Price */}
              {slide.priceLabel && slide.price && (
                <motion.div variants={textItem} className="mt-4 sm:mt-5">
                  <p className="mb-0.5 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                    {slide.priceLabel}
                  </p>
                  <p className="font-display font-black leading-none text-[#F5E642] [font-size:clamp(1.6rem,5vw,3rem)]">
                    {slide.price}
                  </p>
                </motion.div>
              )}

              {/* Categories */}
              {slide.categories && (
                <motion.p
                  variants={textItem}
                  className="mt-3 font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-white/35 sm:mt-4"
                >
                  {slide.categories}
                </motion.p>
              )}

              {/* CTA + Badge */}
              <motion.div variants={textItem} className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
                <Link href={slide.ctaLink} className="btn-terra shadow-lg shadow-terra/30">
                  {slide.ctaText}
                </Link>
                {slide.badge && (
                  <span
                    className="inline-flex items-center rounded-full px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.16)", backdropFilter: "blur(8px)" }}
                  >
                    {slide.badge}
                  </span>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Bottom nav bar ── */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center gap-4 px-5 pb-5 sm:gap-6 sm:px-10 sm:pb-8">

          {/* Counter */}
          <div className="flex shrink-0 items-baseline gap-1.5 font-sans">
            <span className="text-[15px] font-semibold tabular-nums text-white">{numLabel}</span>
            <span className="text-[11px] text-white/30">/ {totalLabel}</span>
          </div>

          {/* Progress strips */}
          <div className="flex flex-1 items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/15 transition-all hover:bg-white/25"
              >
                {i < current && (
                  <span className="absolute inset-0 rounded-full bg-terra/70" />
                )}
                {i === current && (
                  <motion.span
                    key={`bar-${current}`}
                    className="absolute inset-y-0 left-0 rounded-full bg-terra"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: DURATION / 1000, ease: "linear", delay: 0.1 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Prev / Next (desktop) */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/55 transition-all hover:border-white/50 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/55 transition-all hover:border-white/50 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
