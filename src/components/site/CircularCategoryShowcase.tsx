"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export type CatOrbitItem = {
  slug:      string;
  name:      string;
  count?:    number;
  thumbUrl?: string | null;
};

const CONTAINER  = 900;
const CENTER     = 420;
const RADIUS     = 350;

/* Mobile orbit dimensions */
const M_SIZE   = 320;
const M_CENTER = 140;
const M_RADIUS = 128;

export function CircularCategoryShowcase({
  categories,
  totalPieces,
}: {
  categories:  CatOrbitItem[];
  totalPieces: number;
}) {
  const [mounted,    setMounted]    = useState(false);
  const [active,     setActive]     = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  /* Desktop orbit */
  const orbitRef    = useRef<HTMLDivElement>(null);
  const animRef     = useRef<Animation | null>(null);
  const labelRefs   = useRef<(HTMLButtonElement | null)[]>([]);
  const rafRef      = useRef<number>(0);

  /* Mobile orbit */
  const mobileOrbitRef  = useRef<HTMLDivElement>(null);
  const mobileAnimRef   = useRef<Animation | null>(null);
  const mobileLabelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileRafRef    = useRef<number>(0);

  const activeRef   = useRef(0);
  const touchStartX = useRef(0);
  const pauseTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  activeRef.current = active;

  const router    = useRouter();
  const n         = categories.length;
  const activeCat = categories[active] ?? categories[0];

  /* ── 1. Mount flag ── */
  useEffect(() => { setMounted(true); }, []);

  /* ── 2. Preload all images client-side ── */
  useEffect(() => {
    if (!mounted) return;
    categories.forEach((cat) => {
      if (!cat.thumbUrl) return;
      const img = new window.Image();
      img.src = cat.thumbUrl;
    });
  }, [mounted, categories]);

  /* ── 3. Auto-shuffle 2.5 s — paused while isHovering ── */
  useEffect(() => {
    if (!mounted || isHovering || n === 0) return;
    const id = setInterval(() => setActive((p) => (p + 1) % n), 2500);
    return () => clearInterval(id);
  }, [mounted, isHovering, n]);

  /* ── 4. DESKTOP WAAPI orbit 60 s/rev + rAF counter-rotation ── */
  useEffect(() => {
    if (!mounted) return;
    const el = orbitRef.current;
    if (!el || n === 0) return;

    const anim = el.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      { duration: 60000, iterations: Infinity, easing: "linear" },
    );
    animRef.current = anim;

    const tick = () => {
      if (anim.currentTime !== null) {
        const deg = ((anim.currentTime as number) % 60000) / 60000 * 360;
        labelRefs.current.forEach((btn, i) => {
          if (!btn) return;
          const angle = (i * 360) / n;
          const scale = i === activeRef.current ? 1.2 : 1;
          btn.style.transform =
            `translate(-50%, -50%) rotate(${-(angle + deg)}deg) scale(${scale})`;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(rafRef.current); anim.cancel(); };
  }, [mounted, n]);

  /* ── 5. MOBILE WAAPI orbit 60 s/rev + rAF counter-rotation ── */
  useEffect(() => {
    if (!mounted) return;
    const el = mobileOrbitRef.current;
    if (!el || n === 0) return;

    const anim = el.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      { duration: 60000, iterations: Infinity, easing: "linear" },
    );
    mobileAnimRef.current = anim;

    const tick = () => {
      if (anim.currentTime !== null) {
        const deg = ((anim.currentTime as number) % 60000) / 60000 * 360;
        mobileLabelRefs.current.forEach((btn, i) => {
          if (!btn) return;
          const angle = (i * 360) / n;
          const scale = i === activeRef.current ? 1.15 : 1;
          btn.style.transform =
            `translate(-50%, -50%) rotate(${-(angle + deg)}deg) scale(${scale})`;
        });
      }
      mobileRafRef.current = requestAnimationFrame(tick);
    };
    mobileRafRef.current = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(mobileRafRef.current); anim.cancel(); };
  }, [mounted, n]);

  /* ── 6. Pause / resume both orbits ── */
  useEffect(() => {
    const da = animRef.current;
    const ma = mobileAnimRef.current;
    if (da) isHovering ? da.pause() : da.play();
    if (ma) isHovering ? ma.pause() : ma.play();
  }, [isHovering]);

  /* ── 7. Cleanup mobile pause timer ── */
  useEffect(() => () => {
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
  }, []);

  /** Pause shuffle for `ms` then auto-resume (mobile touch) */
  const pauseFor = (ms: number) => {
    setIsHovering(true);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => setIsHovering(false), ms);
  };

  const mobileSelect = (i: number) => { setActive(i); pauseFor(5000); };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) < 40) return;
    setActive((p) => delta < 0 ? (p + 1) % n : (p - 1 + n) % n);
    pauseFor(5000);
  };

  /* ─────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────── */
  return (
    <section className="w-full overflow-hidden bg-[#fcf9f6]">

      {/* ── Section heading — always SSR-safe ── */}
      <div className="container-px pt-20 pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The Catalogue</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight text-ink">
              {n} categories,{" "}
              <span className="text-terra">{totalPieces} pieces</span>{" "}
              handcrafted.
            </h2>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1.5 text-sm font-sans font-medium text-inkMuted hover:text-terra transition-colors"
          >
            All collections <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Loading skeleton — fully static, zero data-dependent rendering */}
      {!mounted && (
        <>
          {/* Desktop skeleton */}
          <div className="hidden md:flex justify-center pb-20">
            <div className="relative shrink-0" style={{ width: CONTAINER, height: CONTAINER }}>
              <div
                className="pointer-events-none absolute rounded-full border border-dashed border-inkBorder/60"
                style={{ width: "88%", height: "88%", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              />
              <div
                className="pointer-events-none absolute rounded-full border border-inkBorder/30"
                style={{ width: "58%", height: "58%", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              />
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone"
                style={{ width: CENTER, height: CENTER, border: "12px solid white",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.10)" }}
              />
            </div>
          </div>

          {/* Mobile skeleton */}
          <div className="flex md:hidden flex-col items-center pb-20 gap-5">
            <div className="relative shrink-0" style={{ width: M_SIZE, height: M_SIZE }}>
              <div
                className="pointer-events-none absolute rounded-full border border-dashed border-inkBorder/60"
                style={{ width: "88%", height: "88%", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              />
              <div
                className="pointer-events-none absolute rounded-full border border-inkBorder/30"
                style={{ width: "58%", height: "58%", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              />
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone"
                style={{ width: M_CENTER, height: M_CENTER, border: "8px solid white",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.22)" }}
              />
            </div>
            <div className="h-6 w-28 rounded-full bg-stone/60" />
          </div>
        </>
      )}

      {mounted && (
        <>

          {/* ════════ DESKTOP ≥ 768 px — revolving WAAPI orbit ════════ */}
          <div className="hidden md:flex justify-center pb-20">
            <div
              className="relative shrink-0 select-none"
              style={{ width: CONTAINER, height: CONTAINER }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Guide rings */}
              <div
                className="pointer-events-none absolute rounded-full border border-dashed border-inkBorder/60"
                style={{ width: "88%", height: "88%", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              />
              <div
                className="pointer-events-none absolute rounded-full border border-inkBorder/30"
                style={{ width: "58%", height: "58%", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              />

              {/* Orbit ring — WAAPI rotates this, rAF counter-rotates labels */}
              <div ref={orbitRef} className="absolute inset-0">
                {categories.map((cat, i) => {
                  const angle    = (i * 360) / n;
                  const isActive = i === active;
                  return (
                    <div
                      key={cat.slug}
                      className="absolute top-1/2 left-1/2"
                      style={{ width: 0, height: 0, transform: `rotate(${angle}deg) translateX(${RADIUS}px)` }}
                    >
                      <button
                        ref={(el) => { labelRefs.current[i] = el; }}
                        style={{
                          position: "absolute",
                          transform: `translate(-50%, -50%) rotate(${-angle}deg) scale(${isActive ? 1.2 : 1})`,
                        }}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => router.push(`/category/${cat.slug}`)}
                        className={[
                          "whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-sans font-semibold",
                          "cursor-pointer transition-colors duration-300",
                          isActive
                            ? "bg-[#c26a3f] text-white shadow-[0_6px_24px_rgba(194,106,63,0.45)]"
                            : "bg-white text-black shadow-sm hover:bg-[#c26a3f]/10 hover:text-[#c26a3f]",
                        ].join(" ")}
                      >
                        {cat.name}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Center circle — 420 px — click navigates to active category */}
              <div
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full cursor-pointer"
                style={{ width: CENTER, height: CENTER, border: "12px solid white",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.10)" }}
                onClick={() => router.push(`/category/${activeCat?.slug}`)}
              >
                <span className="pointer-events-none absolute inset-0 z-20 rounded-full ring-1 ring-inset ring-white/30" />
                <AnimatePresence mode="wait">
                  {activeCat?.thumbUrl ? (
                    <motion.div
                      key={activeCat.slug}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activeCat.thumbUrl}
                        alt={activeCat.name}
                        fill
                        priority
                        sizes="420px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <p className="absolute bottom-8 inset-x-4 text-center text-[13px] font-display font-semibold uppercase tracking-wider text-white/90">
                        {activeCat.name}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeCat.slug}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex h-full w-full items-center justify-center bg-stone"
                    >
                      <span className="px-8 text-center font-display text-2xl font-semibold text-ink">
                        {activeCat?.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Piece-count badge */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-10"
                style={{ transform: `translate(-50%, ${CENTER / 2 + 18}px)` }}
              >
                <span key={active} className="badge-blush animate-fade-up">
                  {activeCat?.count ?? 0} pieces
                </span>
              </div>
            </div>
          </div>

          {/* ════════ MOBILE < 768 px — scaled revolving orbit ════════ */}
          <div
            className="flex md:hidden flex-col items-center pb-20 gap-5"
            onTouchStart={(e) => { setIsHovering(true); onTouchStart(e); }}
            onTouchEnd={(e) => { onTouchEnd(e); pauseFor(5000); }}
          >
            <div
              className="relative shrink-0 select-none overflow-visible"
              style={{ width: M_SIZE, height: M_SIZE }}
            >
              {/* Guide rings */}
              <div
                className="pointer-events-none absolute rounded-full border border-dashed border-inkBorder/60"
                style={{ width: "88%", height: "88%", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              />
              <div
                className="pointer-events-none absolute rounded-full border border-inkBorder/30"
                style={{ width: "58%", height: "58%", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              />

              {/* Mobile orbit ring — WAAPI rotates, rAF counter-rotates labels */}
              <div ref={mobileOrbitRef} className="absolute inset-0">
                {categories.map((cat, i) => {
                  const angle    = (i * 360) / n;
                  const isActive = i === active;
                  return (
                    <div
                      key={cat.slug}
                      className="absolute top-1/2 left-1/2"
                      style={{ width: 0, height: 0, transform: `rotate(${angle}deg) translateX(${M_RADIUS}px)` }}
                    >
                      <button
                        ref={(el) => { mobileLabelRefs.current[i] = el; }}
                        style={{
                          position: "absolute",
                          transform: `translate(-50%, -50%) rotate(${-angle}deg) scale(${isActive ? 1.15 : 1})`,
                        }}
                        onClick={() => router.push(`/category/${cat.slug}`)}
                        className={[
                          "whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-sans font-semibold",
                          "cursor-pointer transition-colors duration-300",
                          isActive
                            ? "bg-[#c26a3f] text-white shadow-[0_4px_12px_rgba(194,106,63,0.45)]"
                            : "bg-white text-black shadow-sm",
                        ].join(" ")}
                      >
                        {cat.name}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Center circle — 140 px */}
              <div
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full cursor-pointer"
                style={{ width: M_CENTER, height: M_CENTER, border: "8px solid white",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.22)" }}
                onClick={() => router.push(`/category/${activeCat?.slug}`)}
              >
                <span className="pointer-events-none absolute inset-0 z-20 rounded-full ring-1 ring-inset ring-white/30" />
                <AnimatePresence mode="wait">
                  {activeCat?.thumbUrl ? (
                    <motion.div
                      key={activeCat.slug + "-m"}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.55, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activeCat.thumbUrl}
                        alt={activeCat.name}
                        fill
                        priority
                        sizes="140px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <p className="absolute bottom-3 inset-x-1 text-center text-[8px] font-display font-semibold uppercase tracking-wider text-white/90">
                        {activeCat.name}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeCat.slug + "-m"}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.55 }}
                      className="flex h-full w-full items-center justify-center bg-stone"
                    >
                      <span className="px-3 text-center font-display text-sm font-semibold text-ink">
                        {activeCat?.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Piece-count badge */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-10"
                style={{ transform: `translate(-50%, ${M_CENTER / 2 + 14}px)` }}
              >
                <span key={active} className="badge-blush animate-fade-up">
                  {activeCat?.count ?? 0} pieces
                </span>
              </div>
            </div>

            {/* Category name below orbit */}
            <div className="text-center px-4">
              <p
                key={active}
                className="font-display text-xl font-semibold text-ink animate-fade-up"
              >
                {activeCat?.name}
              </p>
              <p className="mt-1 text-[11px] font-sans text-inkMuted/50">
                {isHovering ? "paused" : "auto-cycling"} · tap to select
              </p>
            </div>
          </div>

        </>
      )}

    </section>
  );
}
