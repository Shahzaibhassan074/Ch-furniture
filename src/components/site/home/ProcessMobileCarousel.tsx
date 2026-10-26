"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Consultation & Design",
    body: "We discuss your space, style and requirements, then translate them into a detailed design you approve.",
    image: "/images/process/process-01-consultation-design.jpg",
    alt: "Furniture design consultation at CH Furniture House",
  },
  {
    n: "02",
    title: "Wood Selection & Seasoning",
    body: "Premium seasoned timber is hand-selected. We do not rush the drying — that is what prevents warping later.",
    image: "/images/process/process-02-wood-selection-seasoning.jpg",
    alt: "Premium wood selection and seasoning",
  },
  {
    n: "03",
    title: "Crafting & Hand-Carving",
    body: "Skilled craftsmen cut, join and hand-carve each component. Carving is not decoration — it is the structure.",
    image: "/images/process/process-03-crafting-hand-carving.jpg",
    alt: "Hand carving and crafting furniture",
  },
  {
    n: "04",
    title: "Finishing & Delivery",
    body: "Premium finishing and quality checks, then careful delivery and setup at your home. We take the packaging.",
    image: "/images/process/process-04-finishing-delivery.jpg",
    alt: "Furniture finishing and white-glove delivery",
  },
];

const AUTOPLAY_MS    = 3000;
const RESUME_DELAY_MS = 5000;

export function ProcessMobileCarousel() {
  const trackRef   = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const resumeRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mirrors of state values kept in refs so setTimeout callbacks always see fresh values
  const sectionVisRef = useRef(false);
  const tabVisRef     = useRef(true);
  const reducedRef    = useRef(false);

  const [active,  setActive]  = useState(0);
  const [playing, setPlaying] = useState(false);
  // Incrementing this key remounts the fill span → restarts the CSS animation from 0 %
  const [animKey, setAnimKey] = useState(0);
  const [reduced, setReduced] = useState(false);

  // Keep reducedRef in sync with reduced state
  useEffect(() => { reducedRef.current = reduced; }, [reduced]);

  // ── prefers-reduced-motion ─────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches;
      setReduced(e.matches);
      if (e.matches) setPlaying(false);
    };
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // ── Section visibility — start autoplay when scrolled into view ───────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        sectionVisRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          setPlaying(false);
        } else if (tabVisRef.current && !reducedRef.current) {
          setPlaying(true);
          setAnimKey(k => k + 1);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Tab (page) visibility ──────────────────────────────────────────────────
  useEffect(() => {
    const h = () => {
      tabVisRef.current = !document.hidden;
      if (document.hidden) {
        setPlaying(false);
      } else if (sectionVisRef.current && !reducedRef.current) {
        setPlaying(true);
        setAnimKey(k => k + 1);
      }
    };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, []);

  // ── Active-card tracking via IntersectionObserver on the scroll track ─────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll("[data-card]")) as HTMLElement[];
    const observers = cards.map((card, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio >= 0.5) setActive(i);
        },
        { root: track, threshold: 0.5 }
      );
      obs.observe(card);
      return obs;
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // ── Core autoplay timer — re-arms after every active / playing change ─────
  useEffect(() => {
    if (!playing || reduced) return;
    const id = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const next = (active + 1) % STEPS.length;
      const card = track.querySelectorAll("[data-card]")[next] as HTMLElement;
      if (card) {
        const pad = parseInt(getComputedStyle(track).scrollPaddingLeft) || 0;
        track.scrollTo({ left: card.offsetLeft - pad, behavior: "smooth" });
      }
      setActive(next);
      setAnimKey(k => k + 1);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, playing, reduced]);

  // ── Cleanup resume timer on unmount ───────────────────────────────────────
  useEffect(() => {
    return () => {
      if (resumeRef.current !== null) clearTimeout(resumeRef.current);
    };
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const clearResumeTimer = useCallback(() => {
    if (resumeRef.current !== null) {
      clearTimeout(resumeRef.current);
      resumeRef.current = null;
    }
  }, []);

  const scheduleResume = useCallback(() => {
    clearResumeTimer();
    resumeRef.current = setTimeout(() => {
      if (sectionVisRef.current && tabVisRef.current && !reducedRef.current) {
        setPlaying(true);
        setAnimKey(k => k + 1);
      }
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer]);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelectorAll("[data-card]")[i] as HTMLElement;
      if (!card) return;
      const pad = parseInt(getComputedStyle(track).scrollPaddingLeft) || 0;
      track.scrollTo({
        left: card.offsetLeft - pad,
        behavior: reducedRef.current ? "auto" : "smooth",
      });
      setActive(i);
      setPlaying(false);
      setAnimKey(k => k + 1);
      scheduleResume();
    },
    [scheduleResume]
  );

  const onTouchStart = useCallback(() => {
    setPlaying(false);
    clearResumeTimer();
  }, [clearResumeTimer]);

  const onTouchEnd = useCallback(() => {
    scheduleResume();
  }, [scheduleResume]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft" && active > 0) {
        e.preventDefault();
        goTo(active - 1);
      } else if (e.key === "ArrowRight" && active < STEPS.length - 1) {
        e.preventDefault();
        goTo(active + 1);
      }
    },
    [active, goTo]
  );

  const togglePlay = useCallback(() => {
    if (playing) {
      setPlaying(false);
      clearResumeTimer();
    } else if (sectionVisRef.current && tabVisRef.current && !reducedRef.current) {
      setPlaying(true);
      setAnimKey(k => k + 1);
    }
  }, [playing, clearResumeTimer]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={sectionRef} className="md:hidden" onKeyDown={handleKeyDown}>
      {/* Section heading */}
      <div className="mb-6">
        <p className="eyebrow">Made to order</p>
        <h2 className="mt-3 font-display text-[clamp(1.9rem,7vw,2.4rem)] font-bold leading-tight text-ink">
          Why it takes{" "}
          <span className="text-terra">several weeks.</span>
        </h2>
      </div>

      {/* Scroll track — bleeds past container-px (px-5 mobile, px-8 sm) */}
      <div className="-mx-5 sm:-mx-8">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-pl-5 sm:scroll-pl-8 pl-5 sm:pl-8 gap-3 pb-1"
          role="region"
          aria-label="Process steps carousel"
          aria-live={playing ? "off" : "polite"}
          tabIndex={0}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              data-card=""
              className="snap-start shrink-0 w-[calc(100vw-60px)] sm:w-[calc(100vw-88px)] rounded-2xl overflow-hidden bg-parchment border border-inkBorder/40 shadow-sm"
              role="group"
              aria-roledescription="slide"
              aria-label={`Step ${step.n} of ${STEPS.length}: ${step.title}`}
            >
              {/* Card image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  className="object-cover"
                  sizes="calc(100vw - 60px)"
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>

              {/* Card text */}
              <div className="p-5">
                <span className="font-sans text-sm font-semibold text-terra">{step.n}</span>
                <h3 className="mt-1 font-display text-xl font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-inkMuted">{step.body}</p>
              </div>
            </div>
          ))}

          {/* Trailing spacer so the last card can reach its snap position */}
          <div className="shrink-0 w-5 sm:w-8" aria-hidden="true" />
        </div>
      </div>

      {/* Controls row */}
      <div className="mt-5 flex items-center justify-between">

        {/* Progress indicators — each becomes a timer bar while active */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Slide indicators">
          {STEPS.map((step, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to step ${i + 1}: ${step.title}`}
              onClick={() => goTo(i)}
              className={`relative h-[3px] overflow-hidden rounded-full bg-inkBorder/40 transition-[width] duration-300 ${
                i <= active ? "w-8" : "w-4"
              }`}
            >
              {/* Past cards — always full orange */}
              {i < active && (
                <span className="absolute inset-0 rounded-full bg-terra" />
              )}

              {/* Active card — animated fill that acts as the countdown timer */}
              {i === active && (
                <span
                  key={animKey}
                  className="absolute inset-y-0 left-0 rounded-full bg-terra"
                  style={{
                    animationName: "proc-fill",
                    animationDuration: `${AUTOPLAY_MS}ms`,
                    animationTimingFunction: "linear",
                    animationFillMode: "both",
                    animationPlayState: playing ? "running" : "paused",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Arrow buttons + accessible pause/play (sr-only, visible on keyboard focus) */}
        <div className="flex items-center gap-2">
          {!reduced && (
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pause autoplay" : "Resume autoplay"}
              aria-pressed={!playing}
              className="sr-only focus-visible:not-sr-only focus-visible:flex focus-visible:h-9 focus-visible:w-9 focus-visible:items-center focus-visible:justify-center focus-visible:rounded-full focus-visible:border focus-visible:border-inkBorder focus-visible:bg-white focus-visible:text-ink"
            >
              {playing
                ? <Pause size={16} aria-hidden="true" />
                : <Play  size={16} aria-hidden="true" />}
            </button>
          )}

          <button
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous step"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-inkBorder bg-white text-ink transition-all active:scale-95 disabled:opacity-30"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <button
            onClick={() => goTo(active + 1)}
            disabled={active === STEPS.length - 1}
            aria-label="Next step"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-inkBorder bg-white text-ink transition-all active:scale-95 disabled:opacity-30"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
