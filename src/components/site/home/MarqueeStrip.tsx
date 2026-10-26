"use client";

import { MARQUEE_MESSAGES } from "./slides";

// Edit MARQUEE_MESSAGES in slides.ts to change the text
const stripText = MARQUEE_MESSAGES.join("  •  ") + "  •  ";

export function MarqueeStrip() {
  return (
    <div
      className="ch-marquee-root relative z-10"
      style={{
        backgroundColor: "#F5E642",
        overflow: "hidden",
        height: "52px",
        display: "flex",
        alignItems: "center",
      }}
      aria-label="Announcements"
    >
      {/* Two identical copies — translateX(-50%) shifts by exactly one copy width → seamless loop */}
      <div className="ch-marquee-track">
        <span
          style={{
            color: "#6B1E1E",
            fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
            fontWeight: 600,
            fontSize: "clamp(13px, 1vw, 17px)",
            lineHeight: 1,
            padding: "0 32px",
          }}
        >
          {stripText}
        </span>
        <span
          aria-hidden
          style={{
            color: "#6B1E1E",
            fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
            fontWeight: 600,
            fontSize: "clamp(13px, 1vw, 17px)",
            lineHeight: 1,
            padding: "0 32px",
          }}
        >
          {stripText}
        </span>
      </div>
    </div>
  );
}
