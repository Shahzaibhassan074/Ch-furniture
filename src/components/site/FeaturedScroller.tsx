"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeaturedScroller({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [update]);

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Prev — always in DOM, hidden via CSS to avoid hydration mismatch */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className={cn(
          onDark
            ? "absolute -left-4 top-[40%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-terra border border-white/20 hover:bg-white/90 shadow-md transition-all duration-200"
            : "absolute -left-4 top-[40%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md border border-inkBorder text-ink hover:bg-parchment transition-all duration-200",
          canLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Next — always in DOM, hidden via CSS to avoid hydration mismatch */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className={cn(
          onDark
            ? "absolute -right-4 top-[40%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-terra border border-white/20 hover:bg-white/90 shadow-md transition-all duration-200"
            : "absolute -right-4 top-[40%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md border border-inkBorder text-ink hover:bg-parchment transition-all duration-200",
          canRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Scroll track */}
      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
      >
        {children}
      </div>

      {/* Progress bar */}
      <div className={cn("mt-3 h-[2px] w-full rounded-full overflow-hidden", onDark ? "bg-white/20" : "bg-inkBorder")}>
        <div className={cn("h-full w-1/3 rounded-full", onDark ? "bg-white/50" : "bg-inkMuted/40")} />
      </div>
    </div>
  );
}
