"use client";

import { useState } from "react";

const QG = [
  { key: "piece", title: "What piece?", opts: ["Jahez package", "Bed set", "Sofa set", "Dewan", "Dining set", "Wardrobe", "Other"] },
  { key: "wood", title: "Which wood?", opts: ["Sheesham", "Walnut", "Teak", "Oak", "Not sure"] },
  { key: "size", title: "Size", opts: ["Standard", "Custom size"] },
  { key: "city", title: "Deliver to", opts: ["Sialkot", "Lahore", "Islamabad", "Karachi", "Other city", "Outside Pakistan"] },
] as const;

type Answers = { piece: string; wood: string; size: string; city: string };

export function MobileQuoteCTA() {
  const [open, setOpen] = useState(false);
  const [qa, setQa] = useState<Answers>({
    piece: "Jahez package",
    wood: "Sheesham",
    size: "Standard",
    city: "Sialkot",
  });

  const qMsg = `Hello CH FURNITURE, I would like a quote for a ${qa.piece} in ${qa.wood} (${qa.size.toLowerCase()}), delivered to ${qa.city}.`;
  const qLink = `https://wa.me/923416309652?text=${encodeURIComponent(qMsg)}`;

  return (
    <>
      <section
        style={{
          marginTop: "34px",
          padding: "30px 20px",
          background: "#23402F",
          color: "#FFFFFF",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2.2px",
            textTransform: "uppercase",
            color: "#D9B877",
          }}
        >
          Made to order
        </p>
        <h2
          style={{
            margin: "8px 0 0",
            fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
            fontWeight: 500,
            fontSize: "28px",
            lineHeight: 1.12,
          }}
        >
          Have a piece in mind?{" "}
          <span style={{ fontStyle: "italic", color: "#D9B877" }}>
            Get a quote in 4 taps.
          </span>
        </h2>
        <p
          style={{
            margin: "10px 0 0",
            fontSize: "14px",
            lineHeight: 1.55,
            color: "#C9D6CD",
          }}
        >
          Choose the piece, wood, size and city — we reply with pricing on WhatsApp.
        </p>
        <button
          onClick={() => setOpen(true)}
          style={{
            marginTop: "18px",
            width: "100%",
            height: "52px",
            border: 0,
            borderRadius: "26px",
            background: "#A64A25",
            color: "#FFFFFF",
            fontFamily: "inherit",
            fontSize: "13.5px",
            fontWeight: 700,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Build my quote
        </button>
      </section>

      {open && (
        <>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close quote builder"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              border: 0,
              background: "rgba(14,22,17,.5)",
              cursor: "pointer",
            }}
          />
          <div
            role="dialog"
            aria-label="Build my quote"
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 51,
              maxHeight: "92%",
              overflowY: "auto",
              background: "#FFFFFF",
              borderRadius: "22px 22px 0 0",
              padding: "10px 20px 22px",
              boxSizing: "border-box",
              animation: "m-sheet-up .42s cubic-bezier(.16,1,.3,1) both",
            } as React.CSSProperties}
          >
            <div
              style={{
                width: "44px",
                height: "5px",
                borderRadius: "3px",
                background: "#D9D4CC",
                margin: "0 auto",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                Build my quote
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  width: "44px",
                  height: "44px",
                  border: 0,
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {QG.map((g, gi) => (
              <div key={g.key}>
                <p
                  style={{
                    margin: "14px 0 0",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "#5F5A54",
                  }}
                >
                  {gi + 1}. {g.title}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "8px",
                  }}
                >
                  {g.opts.map((opt) => {
                    const on = qa[g.key] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setQa({ ...qa, [g.key]: opt })}
                        style={{
                          height: "40px",
                          padding: "0 14px",
                          borderRadius: "20px",
                          border: `1.5px solid ${on ? "#23402F" : "#D9D4CC"}`,
                          background: on ? "#23402F" : "#FFFFFF",
                          color: on ? "#FFFFFF" : "#1A1A1A",
                          fontFamily: "inherit",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: "16px",
                background: "#F5F3EF",
                padding: "12px 14px",
                fontSize: "13px",
                lineHeight: 1.5,
                color: "#3D3A36",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#A64A25",
                }}
              >
                Your message
              </span>
              {qMsg}
            </div>

            <a
              href={qLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "14px",
                height: "54px",
                borderRadius: "27px",
                background: "#1B7F45",
                color: "#FFFFFF",
                fontSize: "15px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" />
              </svg>
              Send on WhatsApp
            </a>
          </div>
        </>
      )}
    </>
  );
}
