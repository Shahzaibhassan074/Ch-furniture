"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Media =
  | { type: "image"; url: string; alt?: string }
  | { type: "video"; url: string; poster?: string };

export function ProductGallery({ media, name }: { media: Media[]; name: string }) {
  const [active,   setActive]   = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const safe    = media.length ? media : [{ type: "image" as const, url: "", alt: name }];
  const current = safe[Math.min(active, safe.length - 1)];

  const next = useCallback(() => setActive((i) => (i + 1) % safe.length),               [safe.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + safe.length) % safe.length), [safe.length]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     setLightbox(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, next, prev]);

  return (
    <div>
      {/* Main viewer */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-inkBorder bg-stone">
        {current.type === "video" ? (
          <video src={current.url} poster={current.poster} controls className="h-full w-full object-cover" />
        ) : current.url ? (
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="group block h-full w-full"
            aria-label="Open full-screen preview"
          >
            <Image
              src={current.url}
              alt={current.alt || name}
              fill priority
              sizes="(max-width:768px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </button>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-inkMuted">No image</div>
        )}

        {safe.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink shadow backdrop-blur hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink shadow backdrop-blur hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {safe.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {safe.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-18 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                i === active ? "border-terra" : "border-inkBorder opacity-70 hover:opacity-100"
              }`}
              aria-label={`View media ${i + 1}`}
            >
              {m.type === "video" ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                  {m.poster && <Image src={m.poster} alt="" fill className="object-cover" />}
                </>
              ) : (
                m.url && <Image src={m.url} alt="" fill className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && current.type === "image" && current.url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4"
            onClick={() => setLightbox(false)}
          >
            <button aria-label="Close" className="absolute right-5 top-5 text-white/70 hover:text-white">
              <X className="h-8 w-8" />
            </button>
            <div className="relative h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image src={current.url} alt={current.alt || name} fill className="object-contain" />
              {safe.length > 1 && (
                <>
                  <button
                    onClick={prev} aria-label="Previous"
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={next} aria-label="Next"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
