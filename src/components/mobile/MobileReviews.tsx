"use client";

type Testimonial = {
  id?: string;
  author: string;
  role?: string | null;
  quote: string;
  rating?: number;
};

type Props = { testimonials: Testimonial[] };

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span aria-label={`${n} out of 5 stars`} role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{ color: i < n ? "#D9B877" : "#D9D4CC", fontSize: "14px" }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

export function MobileReviews({ testimonials }: Props) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section style={{ padding: "34px 0 0" }}>
      <div style={{ padding: "0 14px" }}>
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
          Kind words
        </p>
        <h2
          style={{
            margin: "6px 0 0",
            fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
            fontWeight: 500,
            fontSize: "26px",
            lineHeight: 1.1,
            color: "#1A1A1A",
          }}
        >
          What our clients say
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          padding: "14px 14px 4px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        } as React.CSSProperties}
      >
        {testimonials.map((t, i) => (
          <div
            key={t.id ?? i}
            style={{
              flex: "0 0 280px",
              background: i % 2 === 0 ? "#F5F3EF" : "#EAF0EB",
              borderRadius: "16px",
              padding: "18px 16px",
              boxSizing: "border-box",
            } as React.CSSProperties}
          >
            <Stars n={t.rating ?? 5} />
            <p
              style={{
                margin: "10px 0 0",
                fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                fontStyle: "italic",
                fontSize: "16px",
                lineHeight: 1.5,
                color: "#1A1A1A",
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "13px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              {t.author}
              {t.role && (
                <span
                  style={{
                    display: "block",
                    fontWeight: 500,
                    fontSize: "12px",
                    color: "#5F5A54",
                    marginTop: "2px",
                  }}
                >
                  {t.role}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
