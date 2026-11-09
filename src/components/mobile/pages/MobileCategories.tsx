import Image from "next/image";
import Link from "next/link";
import { MobileInnerLayout } from "@/components/mobile/MobileInnerLayout";

type Category = {
  slug: string;
  name: string;
  thumbUrl: string | null;
  count: number;
  description?: string | null;
};

type Settings = {
  brandName: string;
  phone: string;
  whatsapp: string;
  address?: string;
  businessHours?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
};

type Props = {
  settings: Settings;
  categories: Category[];
};

export function MobileCategories({ settings, categories }: Props) {
  const totalPieces = categories.reduce((s, c) => s + (c.count ?? 0), 0);
  const digits = settings.whatsapp.replace(/\D/g, "");
  const waCustom = `https://wa.me/${digits}?text=${encodeURIComponent(
    "Hello CH FURNITURE, I want a custom piece."
  )}`;

  return (
    <MobileInnerLayout
      settings={settings}
      categories={categories}
      backHref="/"
      backLabel="Back to home"
      title="Collections"
      subtitle={`${categories.length} collections · ${totalPieces} designs`}
    >
      {/* Hero text */}
      <section style={{ padding: "22px 16px 0" }}>
        <p
          role="heading"
          aria-level={1}
          style={{
            margin: 0,
            fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
            fontWeight: 500,
            fontSize: "32px",
            lineHeight: 1.1,
          }}
        >
          Every room,{" "}
          <span style={{ fontStyle: "italic" }}>handcrafted</span>
        </p>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "14px",
            lineHeight: 1.55,
            color: "#5F5A54",
          }}
        >
          Solid wood furniture made to order in our Sialkot workshop — pick a
          collection to start.
        </p>
        <Link
          href="/search"
          style={{
            marginTop: "14px",
            height: "46px",
            borderRadius: "23px",
            background: "#F5F3EF",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0 16px",
            color: "#5F5A54",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          Search sofas, dewan, jhoola…
        </Link>
      </section>

      {/* Category grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "10px",
          padding: "16px 16px 0",
        }}
      >
        {categories.map((cat, i) => {
          const big = i < 2;
          const src =
            cat.thumbUrl ||
            `https://mutdqybilhpwxhextcbl.supabase.co/storage/v1/object/public/product-images/categories/cat__${cat.slug}_thumb.webp`;
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              style={{
                gridColumn: big ? "span 2" : "auto",
                height: big ? "200px" : "172px",
                borderRadius: "16px",
                background: "#F5F3EF",
                position: "relative",
                overflow: "hidden",
                display: "block",
                color: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              {cat.thumbUrl && (
                <Image
                  src={src}
                  alt={cat.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes={big ? "calc(100vw - 32px)" : "calc(50vw - 21px)"}
                />
              )}
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg,rgba(14,22,17,0) 38%,rgba(14,22,17,.8) 100%)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  right: "50px",
                  bottom: "12px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                    fontWeight: 600,
                    fontSize: big ? "28px" : "19px",
                    lineHeight: 1.05,
                  }}
                >
                  {cat.name}
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: "4px",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "#F2D79B",
                  }}
                >
                  {cat.count} designs
                </span>
              </span>
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  bottom: "10px",
                  width: "34px",
                  height: "34px",
                  borderRadius: "17px",
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>

      {/* Custom CTA */}
      <section
        style={{
          margin: "22px 16px 0",
          borderRadius: "16px",
          background: "#23402F",
          padding: "24px 20px",
          color: "#FFFFFF",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
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
            fontSize: "25px",
            lineHeight: 1.15,
          }}
        >
          Don&apos;t see your piece?{" "}
          <span style={{ fontStyle: "italic", color: "#F2D79B" }}>
            We&apos;ll build it.
          </span>
        </h2>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "14px",
            lineHeight: 1.55,
            color: "#C9D6CD",
          }}
        >
          Send a photo or sketch — we make it to your size, wood and finish.
        </p>
        <a
          href={waCustom}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: "16px",
            height: "50px",
            borderRadius: "25px",
            background: "#A64A25",
            color: "#FFFFFF",
            fontSize: "13.5px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          Share your idea
        </a>
      </section>

      <div style={{ height: "40px" }} />
    </MobileInnerLayout>
  );
}
