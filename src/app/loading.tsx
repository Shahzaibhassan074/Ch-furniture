"use client";

import { useEffect, useRef } from "react";
import { CHLogo } from "@/components/site/CHLogo";

/*
  Root page-transition loader — shown for all public routes that don't
  have their own loading.tsx (About, Contact, Categories, etc.).
  Admin routes use their own loaders and are unaffected.
*/
export default function Loading() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef  = useRef<HTMLDivElement>(null);
  const dot1Ref = useRef<HTMLSpanElement>(null);
  const dot2Ref = useRef<HTMLSpanElement>(null);
  const dot3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    /* Logo + tagline fade-in + gentle rise */
    wrapRef.current?.animate(
      [
        { opacity: "0", transform: "translateY(16px)" },
        { opacity: "1", transform: "translateY(0)"    },
      ],
      { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
    );

    /* Three brand-orange bouncing dots */
    const BOUNCE: Keyframe[] = [
      { transform: "translateY(0)"    },
      { transform: "translateY(-8px)" },
      { transform: "translateY(0)"    },
    ];
    const dot = (delay: number): KeyframeAnimationOptions => ({
      duration: 800, delay, iterations: Infinity, easing: "ease-in-out",
    });
    dot1Ref.current?.animate(BOUNCE, dot(0));
    dot2Ref.current?.animate(BOUNCE, dot(150));
    dot3Ref.current?.animate(BOUNCE, dot(300));

    /* Bottom progress-bar shimmer */
    barRef.current?.animate(
      [
        { transform: "translateX(-100%)" },
        { transform: "translateX(500%)"  },
      ],
      { duration: 1500, iterations: Infinity, easing: "cubic-bezier(0.4, 0, 0.6, 1)" },
    );
  }, []);

  return (
    /* Matches the site's warm parchment background */
    <div
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ background: "#FAF7F4" }}
    >
      {/* Centre card */}
      <div
        ref={wrapRef}
        className="flex flex-col items-center gap-7"
        style={{ opacity: 0 }}
      >
        {/* Full-width site logo */}
        <CHLogo
          className="h-8 w-auto sm:h-10"
          /* Keep the logo in its natural ink+brass colors */
        />

        {/* Thin divider */}
        <div
          className="h-px w-16 rounded-full"
          style={{ background: "#E5DDD5" }}
        />

        {/* Three bouncing terra-orange dots */}
        <div className="flex items-end gap-[7px]">
          <span
            ref={dot1Ref}
            className="inline-block h-[8px] w-[8px] rounded-full"
            style={{ background: "#E76A2F" }}
          />
          <span
            ref={dot2Ref}
            className="inline-block h-[8px] w-[8px] rounded-full"
            style={{ background: "#E76A2F", opacity: 0.7 }}
          />
          <span
            ref={dot3Ref}
            className="inline-block h-[8px] w-[8px] rounded-full"
            style={{ background: "#E76A2F", opacity: 0.45 }}
          />
        </div>
      </div>

      {/* Bottom progress bar */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[3px] overflow-hidden"
        style={{ background: "#EDE8E1" }}
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
