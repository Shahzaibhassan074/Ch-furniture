"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  { q: "Do you make fully custom furniture?", a: "Yes. Share your dimensions, style and finish and we build it to order." },
  { q: "How long does an order take?", a: "Typically 4–8 weeks, depending on the piece and the carving involved." },
  { q: "Which woods do you work with?", a: "Sheesham (rosewood), walnut, teak and oak, plus engineered options where suitable." },
  { q: "How can I pay?", a: "Cash, EasyPaisa, JazzCash and bank transfer. Details are shared after order confirmation." },
  { q: "Do you deliver outside Sialkot?", a: "Across Pakistan, with export arranged for international buyers." },
  { q: "Can I visit the workshop?", a: "Yes — we are in Mohala Sardaaran, Sialkot. Message us on WhatsApp to arrange a visit." },
];

export function MobileFAQ() {
  const [openIdx, setOpenIdx] = useState<number>(-1);

  return (
    <section style={{ padding: "28px 14px 0" }}>
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
          fontWeight: 500,
          fontSize: "26px",
          color: "#1A1A1A",
        }}
      >
        Good to know
      </h2>
      <div style={{ marginTop: "10px", borderTop: "1px solid #1A1A1A" }}>
        {FAQ_ITEMS.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} style={{ borderBottom: "1px solid #E8E4DE" }}>
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  minHeight: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "12px 0",
                  border: 0,
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#1A1A1A",
                }}
              >
                <span>{faq.q}</span>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: "22px",
                    fontWeight: 400,
                    lineHeight: 1,
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform .3s",
                    color: "#1A1A1A",
                  }}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <p
                  style={{
                    margin: 0,
                    padding: "0 0 14px",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "#3D3A36",
                    animation: "m-fade .4s ease both",
                  }}
                >
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
