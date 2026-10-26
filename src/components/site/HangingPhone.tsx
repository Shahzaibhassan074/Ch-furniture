"use client";

import { useEffect, useRef } from "react";

const BRAND = "#E76A2F";

const SWING_FRAMES: Keyframe[] = [
  { transform: "rotate(-8deg)" },
  { transform: "rotate(8deg)"  },
  { transform: "rotate(-8deg)" },
];
const SWING_OPTS: KeyframeAnimationOptions = {
  duration: 2000, iterations: Infinity, easing: "ease-in-out",
};

/*
  SVG design — viewBox="0 0 70 295"
  • Attachment ring + tight 20-loop coil  (y 0–180)
  • Connector knob                         (y 180–186)
  • Classic handset: handle + two domes   (y 186–290)
  Transform-origin "50% 2%" ≈ top of attachment ring on any scale.
*/
function PhoneSVG() {
  /* 8 speaker-hole positions around earpiece (radius 9 from centre) */
  const earHoles = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI * 2) / 8;
    return { cx: 35 + Math.cos(a) * 9, cy: 202 + Math.sin(a) * 10 };
  });

  /* 6 mouthpiece holes (radius 6) */
  const mouthHoles = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI * 2) / 6;
    return { cx: 35 + Math.cos(a) * 6, cy: 271 + Math.sin(a) * 6.5 };
  });

  return (
    <svg
      viewBox="0 0 70 295"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        {/* Orange glow drop-shadow */}
        <filter id="ph-s" x="-50%" y="-10%" width="200%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="6"
            floodColor={BRAND} floodOpacity="0.35" />
        </filter>
        {/* Radial gradient: lighter top-left → darker bottom-right */}
        <radialGradient id="dome-g" cx="38%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#f5946a" />
          <stop offset="100%" stopColor="#be5520" />
        </radialGradient>
        <radialGradient id="dome-g2" cx="38%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#f5946a" />
          <stop offset="100%" stopColor="#be5520" />
        </radialGradient>
        {/* Cord gradient for depth */}
        <linearGradient id="cord-g" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#be5520" />
          <stop offset="50%"  stopColor="#f5946a" />
          <stop offset="100%" stopColor="#be5520" />
        </linearGradient>
      </defs>

      {/* ── Attachment ring ── */}
      <circle cx="35" cy="7" r="5"
        stroke={BRAND} strokeWidth="2.5" fill="white" />

      {/* ── Tight coil — 20 S-curve loops, ±10px amplitude, 8px per loop ──
          Odd loops swing RIGHT (cx=45), even loops swing LEFT (cx=25).
          Each bezier: C {cx},{y+1} {cx},{y+7} 35,{y+8}              */}
      <path
        stroke="url(#cord-g)" strokeWidth="2.5" strokeLinecap="round" fill="none"
        filter="url(#ph-s)"
        d="
          M 35 12
          C 45,13 45,19 35,20
          C 25,21 25,27 35,28
          C 45,29 45,35 35,36
          C 25,37 25,43 35,44
          C 45,45 45,51 35,52
          C 25,53 25,59 35,60
          C 45,61 45,67 35,68
          C 25,69 25,75 35,76
          C 45,77 45,83 35,84
          C 25,85 25,91 35,92
          C 45,93 45,99 35,100
          C 25,101 25,107 35,108
          C 45,109 45,115 35,116
          C 25,117 25,123 35,124
          C 45,125 45,131 35,132
          C 25,133 25,139 35,140
          C 45,141 45,147 35,148
          C 25,149 25,155 35,156
          C 45,157 45,163 35,164
          C 25,165 25,171 35,172
        "
      />

      {/* ── Connector knob (coil → earpiece) ── */}
      <circle cx="35" cy="179" r="5.5" fill="#be5520" filter="url(#ph-s)" />

      {/* ── Handset body (drawn back-to-front) ── */}

      {/* Handle — slightly barrel shaped, 26 px wide at tips, 20 px at waist */}
      <path
        fill={BRAND} filter="url(#ph-s)"
        d="M 22 214 C 19 225 19 248 22 260 L 48 260 C 51 248 51 225 48 214 Z"
      />

      {/* Earpiece dome */}
      <ellipse cx="35" cy="203" rx="22" ry="25" fill={BRAND} filter="url(#ph-s)" />
      <ellipse cx="35" cy="203" rx="22" ry="25" fill="url(#dome-g)" />

      {/* Earpiece speaker holes */}
      {earHoles.map(({ cx, cy }, i) => (
        <circle key={i} cx={cx} cy={cy} r="1.8" fill="rgba(0,0,0,0.38)" />
      ))}
      <circle cx="35" cy="202" r="2.2" fill="rgba(0,0,0,0.28)" />

      {/* Mouthpiece dome */}
      <ellipse cx="35" cy="271" rx="18" ry="20" fill={BRAND} filter="url(#ph-s)" />
      <ellipse cx="35" cy="271" rx="18" ry="20" fill="url(#dome-g2)" />

      {/* Mouthpiece holes */}
      {mouthHoles.map(({ cx, cy }, i) => (
        <circle key={i} cx={cx} cy={cy} r="1.4" fill="rgba(0,0,0,0.32)" />
      ))}
      <circle cx="35" cy="271" r="1.8" fill="rgba(0,0,0,0.25)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   HangingPhone
   Single component, responsive via Tailwind width classes.
   Parent must be: position:relative  overflow:visible
─────────────────────────────────────────────────────────────── */
export function HangingPhone() {
  const dropRef      = useRef<HTMLDivElement>(null);
  const swingRef     = useRef<HTMLDivElement>(null);
  const swingAnimRef = useRef<Animation | null>(null);

  useEffect(() => {
    const drop  = dropRef.current;
    const swing = swingRef.current;
    if (!drop || !swing) return;

    /* Hidden at natural layout position while we wait */
    drop.style.opacity = "0";

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        /* Jump above then reveal */
        drop.style.transform = "translateY(-260px)";
        drop.style.opacity   = "1";

        requestAnimationFrame(() => {
          /* Bounce-drop */
          const dropAnim = drop.animate(
            [
              { transform: "translateY(-260px)", easing: "ease-in"  },
              { transform: "translateY(0px)",    easing: "ease-out", offset: 0.62 },
              { transform: "translateY(-22px)",  easing: "ease-in",  offset: 0.76 },
              { transform: "translateY(0px)",    easing: "ease-out", offset: 0.88 },
              { transform: "translateY(-8px)",   easing: "ease-in",  offset: 0.95 },
              { transform: "translateY(0px)" },
            ],
            { duration: 950, fill: "forwards" },
          );

          /* Infinite pendulum starts after drop */
          dropAnim.onfinish = () => {
            swingAnimRef.current = swing.animate(SWING_FRAMES, SWING_OPTS);
          };
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(drop);
    return () => observer.disconnect();
  }, []);

  /* Hover → vibrate then resume swing */
  const onEnter = () => {
    const el = swingRef.current;
    if (!el) return;
    swingAnimRef.current?.pause();
    const vib = el.animate(
      [
        { transform: "scale(1.08) rotate(-4deg)" },
        { transform: "scale(1.08) rotate( 4deg)" },
        { transform: "scale(1.08) rotate(-4deg)" },
        { transform: "scale(1.08) rotate( 4deg)" },
        { transform: "scale(1.08) rotate( 0deg)" },
      ],
      { duration: 380, easing: "ease-in-out" },
    );
    vib.onfinish = () => {
      swingAnimRef.current = el.animate(SWING_FRAMES, SWING_OPTS);
    };
  };

  return (
    /*
      Sizing:
        mobile  < 768 px  → w-10  (40 px) → phone ≈ 40×169 px
        sm     ≥ 640 px  → w-14  (56 px) → phone ≈ 56×236 px
        md     ≥ 768 px  → w-16  (64 px) → phone ≈ 64×270 px
        lg     ≥1024 px  → w-[70px]      → phone ≈ 70×295 px
      Position:
        mobile  → right-[8%]
        desktop → right-[14%]
    */
    <div
      ref={dropRef}
      className="absolute top-0 right-[8%] sm:right-[10%] md:right-[14%]
                 w-10 sm:w-14 md:w-16 lg:w-[70px]
                 z-20 cursor-pointer select-none"
      style={{ pointerEvents: "auto" }}
      onMouseEnter={onEnter}
    >
      {/* transform-origin "50% 2%" lands on attachment ring at any scale */}
      <div ref={swingRef} style={{ transformOrigin: "50% 2%", display: "block" }}>
        <PhoneSVG />
      </div>
    </div>
  );
}
