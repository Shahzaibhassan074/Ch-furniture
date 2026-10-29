"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export function FeaturedScroller({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}) {
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplay.current]
  );

  const [emblaReady, setEmblaReady]     = useState(false);
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snapCount, setSnapCount]       = useState(1);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedSnap(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setEmblaReady(true);
    setSnapCount(emblaApi.scrollSnapList().length);
    onSelect();

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoplay.current.stop();
    }

    const onReInit = () => setSnapCount(emblaApi.scrollSnapList().length);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("reInit", onReInit);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const progress = snapCount > 1 ? selectedSnap / (snapCount - 1) : 1;

  return (
    <div className="relative">
      {/* Prev */}
      <button
        onClick={scrollPrev}
        aria-label="Scroll left"
        className={cn(
          "absolute -left-4 top-[40%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-all duration-200",
          onDark
            ? "bg-white text-terra border border-white/20 hover:bg-white/90"
            : "bg-white border border-inkBorder text-ink hover:bg-parchment",
          emblaReady ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Next */}
      <button
        onClick={scrollNext}
        aria-label="Scroll right"
        className={cn(
          "absolute -right-4 top-[40%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-all duration-200",
          onDark
            ? "bg-white text-terra border border-white/20 hover:bg-white/90"
            : "bg-white border border-inkBorder text-ink hover:bg-parchment",
          emblaReady ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Embla viewport — negative margins bleed cards to container edges */}
      <div
        ref={emblaRef}
        className="overflow-hidden -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
      >
        <div className="flex touch-pan-y gap-5 items-start pb-4">
          {children}
        </div>
      </div>

      {/* Progress bar — tracks selected snap index */}
      <div className={cn("mt-3 h-[2px] w-full rounded-full overflow-hidden", onDark ? "bg-white/20" : "bg-inkBorder")}>
        <div
          className={cn("h-full rounded-full transition-[width] duration-300 ease-out", onDark ? "bg-white/50" : "bg-inkMuted/40")}
          style={{ width: `${Math.max(8, progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
