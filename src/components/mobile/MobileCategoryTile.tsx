import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  count: number;
  thumbUrl: string | null;
};

export function MobileCategoryTile({ slug, name, count, thumbUrl }: Props) {
  const imgSrc =
    thumbUrl ||
    `https://mutdqybilhpwxhextcbl.supabase.co/storage/v1/object/public/product-images/categories/cat__${slug}_thumb.webp`;

  return (
    <Link
      href={`/category/${slug}`}
      style={{
        display: "block",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#23402F",
        textDecoration: "none",
      }}
    >
      <div style={{ paddingBottom: "75%", position: "relative" }}>
        <Image
          src={imgSrc}
          alt={name}
          fill
          style={{ objectFit: "cover", opacity: 0.75 }}
          sizes="(max-width: 768px) 50vw"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px",
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: 500,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {name}
          </p>
          <p
            style={{
              color: "#D9B877",
              fontSize: "10px",
              fontWeight: 600,
              margin: "3px 0 0",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {count} designs
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
