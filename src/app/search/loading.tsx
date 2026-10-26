"use client";

import { useEffect, useRef } from "react";

/*
  Page-specific Suspense loading state for /search.
  Next.js App Router automatically shows this while SearchPage fetches.
  Uses Web Animations API — no framer-motion, no CSS keyframes.
*/
export default function SearchLoading() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const dot1Ref  = useRef<HTMLSpanElement>(null);
  const dot2Ref  = useRef<HTMLSpanElement>(null);
  const dot3Ref  = useRef<HTMLSpanElement>(null);
  const barRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── 1. Whole card fades + rises in ── */
    wrapRef.current?.animate(
      [
        { opacity: "0", transform: "translateY(14px)" },
        { opacity: "1", transform: "translateY(0)"    },
      ],
      { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
    );

    /* ── 2. Three bouncing dots (staggered 180 ms apart) ── */
    const BOUNCE: Keyframe[] = [
      { transform: "translateY(0px)"  },
      { transform: "translateY(-9px)" },
      { transform: "translateY(0px)"  },
    ];
    const dotOpts = (delay: number): KeyframeAnimationOptions => ({
      duration: 800, delay, iterations: Infinity, easing: "ease-in-out",
    });
    dot1Ref.current?.animate(BOUNCE, dotOpts(0));
    dot2Ref.current?.animate(BOUNCE, dotOpts(160));
    dot3Ref.current?.animate(BOUNCE, dotOpts(320));

    /* ── 3. Bottom progress-bar shimmer ── */
    barRef.current?.animate(
      [
        { transform: "translateX(-100%)" },
        { transform: "translateX(500%)"  },
      ],
      { duration: 1400, iterations: Infinity, easing: "cubic-bezier(0.4, 0, 0.6, 1)" },
    );
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ background: "#FFFBF7" }}
    >
      {/* ── Brand card ── */}
      <div
        ref={wrapRef}
        className="flex flex-col items-center gap-6"
        style={{ opacity: 0 }}
      >
        {/* Wordmark */}
        <div className="flex flex-col items-center gap-1 select-none">
          <p
            className="font-display text-[clamp(2.8rem,6vw,4rem)] font-extrabold leading-none tracking-tight"
            style={{ color: "#1C1A18" }}
          >
            CH<span style={{ color: "#E76A2F" }}>.</span>
          </p>
          <p
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: "#8A7F77" }}
          >
            Furniture House
          </p>
        </div>

        {/* Thin rule */}
        <div className="h-px w-10 rounded-full" style={{ background: "#E5DDD5" }} />

        {/* Label */}
        <p
          className="font-sans text-sm font-medium"
          style={{ color: "#8A7F77" }}
        >
          Searching the catalog
        </p>

        {/* Bouncing dots */}
        <div className="flex items-end gap-[7px]">
          <span
            ref={dot1Ref}
            className="inline-block h-[9px] w-[9px] rounded-full"
            style={{ background: "#E76A2F" }}
          />
          <span
            ref={dot2Ref}
            className="inline-block h-[9px] w-[9px] rounded-full"
            style={{ background: "#E76A2F", opacity: 0.75 }}
          />
          <span
            ref={dot3Ref}
            className="inline-block h-[9px] w-[9px] rounded-full"
            style={{ background: "#E76A2F", opacity: 0.5 }}
          />
        </div>
      </div>

      {/* ── Bottom progress bar (fixed, full width) ── */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[3px] overflow-hidden"
        style={{ background: "#F0EAE3" }}
      >
        <div
          ref={barRef}
          className="h-full w-1/4 rounded-full"
          style={{ background: "#E76A2F", transform: "translateX(-100%)" }}
        />
      </div>
    </div>
  );
}
