"use client";

// Loaded with { ssr: false } — window / document are always available here.

import { useState, useEffect, useRef } from "react";

export function WorkshopVideo({
  desktopSrc,
  desktopPoster,
  mobileSrc,
  mobilePoster,
}: {
  desktopSrc: string;
  desktopPoster?: string;
  mobileSrc?: string;
  mobilePoster?: string;
}) {
  // `{ ssr: false }` guarantees window exists — safe to call matchMedia here.
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia("(max-width: 767px)").matches
  );

  // Track live breakpoint changes (DevTools resize, orientation flip, etc.)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);

  const src    = isMobile && mobileSrc ? mobileSrc : desktopSrc;
  const poster = (isMobile && mobilePoster ? mobilePoster : desktopPoster) ?? "";

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    let abandoned = false;

    const arm = () => {
      vid.muted = true;
      vid.setAttribute("muted", "");
    };

    const tryPlay = () => {
      if (abandoned) return;
      arm();
      vid.play().catch(() => {});
    };

    // Only start loading/playing when video is near the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        arm();
        // Trigger browser to start buffering then play.
        vid.load();
        tryPlay();
        vid.addEventListener("canplay",        tryPlay);
        vid.addEventListener("loadeddata",     tryPlay);
        vid.addEventListener("loadedmetadata", tryPlay);
        const once = { once: true, passive: true } as const;
        const onGesture = () => tryPlay();
        window.addEventListener("scroll",     onGesture, once);
        window.addEventListener("touchstart", onGesture, once);
        window.addEventListener("click",      onGesture, once);
      },
      { rootMargin: "200px" }
    );
    observer.observe(vid);

    return () => {
      abandoned = true;
      observer.disconnect();
      vid.removeEventListener("canplay",        tryPlay);
      vid.removeEventListener("loadeddata",     tryPlay);
      vid.removeEventListener("loadedmetadata", tryPlay);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      poster={poster || undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
      onError={(e) => {
        // If the mobile-specific video fails (404, codec issue, etc.),
        // fall back silently to the desktop video so something always plays.
        const vid = e.currentTarget;
        if (vid.src !== desktopSrc && desktopSrc) {
          vid.src = desktopSrc;
          vid.muted = true;
          vid.load();
          vid.play().catch(() => {});
        }
      }}
    />
  );
}
