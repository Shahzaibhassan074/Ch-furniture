"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export function FeaturedScroller({
  children,
  onDark = false,
  headerLeft,
  seeAllHref,
}: {
  children:     React.ReactNode;
  onDark?:      boolean;
  headerLeft?:  React.ReactNode;
  seeAllHref?:  string;
}) {
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplay.current]
  );

  const [emblaReady, setEmblaReady]   = useState(false);
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snapCount, setSnapCount]     = useState(1);
  const [canPrev, setCanPrev]         = useState(false);
  const [canNext, setCanNext]         = useState(true);
  const [isDesktop, setIsDesktop]     = useState(false);

  const updateState = useCallback(() => {
    if (!emblaApi) return;
    setSelectedSnap(emblaApi.selectedScrollSnap());
    setSnapCount(emblaApi.scrollSnapList().length);
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  /* Responsive reInit — loop on mobile, no-loop on desktop */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");

    function applyOptions(desktop: boolean) {
      setIsDesktop(desktop);
      if (!emblaApi) return;
      if (desktop) {
        emblaApi.reInit({
          loop:          false,
          align:         "start" as const,
          containScroll: "trimSnaps" as const,
          slidesToScroll: 1,
        });
        autoplay.current.stop();
      } else {
        emblaApi.reInit({ loop: true, align: "start" as const });
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          autoplay.current.play();
        }
      }
    }

    const handler = (e: MediaQueryListEvent) => applyOptions(e.matches);
    mq.addEventListener("change", handler);
    setIsDesktop(mq.matches);

    return () => mq.removeEventListener("change", handler);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setEmblaReady(true);
    updateState();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoplay.current.stop();
    }
    if (window.matchMedia("(min-width: 768px)").matches) {
      emblaApi.reInit({
        loop:           false,
        align:          "start" as const,
        containScroll:  "trimSnaps" as const,
        slidesToScroll: 1,
      });
      autoplay.current.stop();
    }

    emblaApi.on("select", updateState);
    emblaApi.on("reInit", updateState);
    return () => {
      emblaApi.off("select", updateState);
      emblaApi.off("reInit", updateState);
    };
  }, [emblaApi, updateState]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const progress = snapCount > 1 ? selectedSnap / (snapCount - 1) : 1;

  const desktopArrowClass = cn(
    "hidden md:flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200",
    onDark
      ? "border-white/30 text-white hover:bg-white hover:text-terra disabled:opacity-40"
      : "border-inkBorder text-ink hover:bg-parchment disabled:opacity-40"
  );

  return (
    <div>
      {/* Header row — eyebrow/heading from parent + desktop arrows + See all */}
      {(headerLeft || seeAllHref) && (
        <div className="mb-4 flex items-end justify-between gap-4 md:mb-6">
          <div className="flex-1">{headerLeft}</div>

          {/* Desktop arrows + See all (right side) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={scrollPrev}
              aria-label="Scroll left"
              disabled={isDesktop && !canPrev}
              className={desktopArrowClass}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Scroll right"
              disabled={isDesktop && !canNext}
              className={desktopArrowClass}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {seeAllHref && (
              <Link
                href={seeAllHref}
                className={cn(
                  "btn-ghost-white hidden shrink-0 sm:inline-flex",
                  !onDark && "btn-ghost-ink"
                )}
              >
                See all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {/* Mobile: See all link only */}
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className={cn(
                "btn-ghost-white shrink-0 sm:hidden",
                !onDark && "btn-ghost-ink"
              )}
            >
              See all
            </Link>
          )}
        </div>
      )}

      {/* Embla viewport */}
      <div className="relative">
        {/* Mobile-only overlay arrows */}
        <button
          onClick={scrollPrev}
          aria-label="Scroll left"
          className={cn(
            "md:hidden absolute -left-4 top-[40%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-all duration-200",
            onDark
              ? "bg-white text-terra border border-white/20 hover:bg-white/90"
              : "bg-white border border-inkBorder text-ink hover:bg-parchment",
            emblaReady ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={scrollNext}
          aria-label="Scroll right"
          className={cn(
            "md:hidden absolute -right-4 top-[40%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-all duration-200",
            onDark
              ? "bg-white text-terra border border-white/20 hover:bg-white/90"
              : "bg-white border border-inkBorder text-ink hover:bg-parchment",
            emblaReady ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Embla viewport — bleeds on mobile, exact-width on desktop */}
        <div
          ref={emblaRef}
          className="overflow-hidden -mx-5 px-5 sm:-mx-8 sm:px-8 md:mx-0 md:px-0"
        >
          <div className="flex touch-pan-y gap-5 md:gap-6 items-start md:items-stretch pb-4">
            {children}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className={cn("mt-3 md:mt-10 h-[2px] w-full rounded-full overflow-hidden", onDark ? "bg-white/20" : "bg-inkBorder")}>
        <div
          className={cn("h-full rounded-full transition-[width] duration-300 ease-out", onDark ? "bg-white/50" : "bg-inkMuted/40")}
          style={{ width: `${Math.max(8, progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
