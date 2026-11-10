"use client";

import { useState } from "react";

const WOODS = [
  {
    name: "Sheesham",
    swatch: "#6B3A22",
    body: "Pakistan’s classic rosewood — dense, richly grained and perfect for hand carving.",
    uses: ["Hand carving", "Beds", "Dining sets"],
  },
  {
    name: "Walnut",
    swatch: "#4A3326",
    body: "Deep chocolate tones with a smooth, modern grain. Ideal for clean-lined sofas, beds and media units.",
    uses: ["Sofas", "Beds", "TV units"],
  },
  {
    name: "Teak",
    swatch: "#A06A35",
    body: "Naturally oily and weather-resistant — the go-to for swings, verandah pieces and humid rooms.",
    uses: ["Swings", "Verandah", "Humid rooms"],
  },
  {
    name: "Oak",
    swatch: "#C79A62",
    body: "Light, honest and strong. Great for desks, platform beds and airy, minimal interiors.",
    uses: ["Desks", "Platform beds", "Minimal rooms"],
  },
];

export function MobileWoodGuide() {
  const [active, setActive] = useState(0);
  const wood = WOODS[active];

  return (
    <section style={{ padding: "28px 16px", background: "#F8ECE5" }}>
      <p
        style={{
          margin: 0,
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "2.2px",
          textTransform: "uppercase",
          color: "#A64A25",
        }}
      >
        Wood guide
      </p>
      <h2
        style={{
          margin: "6px 0 0",
          fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
          fontWeight: 500,
          fontSize: "26px",
          color: "#1A1A1A",
        }}
      >
        Which wood is right for you?
      </h2>

      {/* Tiles */}
      <div
        role="tablist"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "6px",
          marginTop: "14px",
        }}
      >
        {WOODS.map((w, i) => (
          <button
            key={w.name}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            style={{
              height: "72px",
              borderRadius: "12px",
              border: `2px solid ${i === active ? "#A64A25" : "#E8E4DE"}`,
              background: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "13px",
                background: w.swatch,
                display: "block",
              }}
            />
            <span
              style={{
                fontFamily: "inherit",
                fontSize: "12px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              {w.name}
            </span>
          </button>
        ))}
      </div>

      {/* Body + chips */}
      <div style={{ marginTop: "14px", animation: "m-fade .4s ease both" }} key={active}>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#3D3A36",
          }}
        >
          {wood.body}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginTop: "10px",
          }}
        >
          {wood.uses.map((u) => (
            <span
              key={u}
              style={{
                height: "30px",
                padding: "0 12px",
                borderRadius: "15px",
                background: "#23402F",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {u}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
