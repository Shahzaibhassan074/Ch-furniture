import Image from "next/image";
import Link from "next/link";
import { MobileInnerLayout } from "@/components/mobile/MobileInnerLayout";

type Settings = {
  brandName: string;
  phone: string;
  whatsapp: string;
  address?: string;
  businessHours?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  yearsExperience?: number;
  projectsCompleted?: number;
  happyClients?: number;
  craftsmenCount?: number;
  founderImageUrl?: string;
  processImageUrl?: string;
  aboutStory?: string;
  aboutMission?: string;
};

type Category = {
  slug: string;
  name: string;
  thumbUrl: string | null;
  count: number;
};

type Props = {
  settings: Settings;
  categories: Category[];
};

const VALUES = [
  {
    bg: "#EAF0EB",
    ink: "#23402F",
    icon: "M12 2l5 7h-3l4 6h-4l3 5H7l3-5H6l4-6H7z",
    title: "Premium hardwood only",
    body: "Sheesham, walnut, teak — seasoned and dried before cutting.",
  },
  {
    bg: "#F8ECE5",
    ink: "#A64A25",
    icon: "M5 3l14 9-14 9V3z",
    title: "Hand-carved details",
    body: "Every floral and geometric motif carved by experienced craftsmen.",
  },
  {
    bg: "#F5F3EF",
    ink: "#23402F",
    icon: "M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
    title: "4–8 week lead time",
    body: "We don't rush the finishing — each coat is cured properly.",
  },
  {
    bg: "#EAF0EB",
    ink: "#23402F",
    icon: "M3 7h12v10H3zM15 10h4l2 3v4h-6M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01",
    title: "All Pakistan delivery",
    body: "We pack, deliver and install anywhere in Pakistan.",
  },
];

export function MobileAbout({ settings, categories }: Props) {
  const heroImg = settings.processImageUrl || settings.founderImageUrl;

  return (
    <MobileInnerLayout
      settings={settings}
      categories={categories}
      backHref="/"
      backLabel="Back to home"
      title="Our story"
      subtitle="Since three generations"
      rightSlot={
        <Link
          href="/contact"
          aria-label="Visit the workshop"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "22px",
            border: "1px solid #E8E4DE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            flexShrink: 0,
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
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        </Link>
      }
    >
      {/* Hero image */}
      <div style={{ position: "relative", height: "300px", background: "#F5F3EF" }}>
        {heroImg && (
          <Image
            src={heroImg}
            alt="A craftsman carving a floral pattern into a sheesham panel"
            fill
            style={{ objectFit: "cover", display: "block" }}
            sizes="100vw"
          />
        )}
        <span
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg,rgba(14,22,17,0) 45%,rgba(14,22,17,.75) 100%)",
          }}
        />
        <p
          style={{
            position: "absolute",
            left: "18px",
            right: "18px",
            bottom: "18px",
            margin: 0,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#F2D79B",
          }}
        >
          The Kalaswala workshop · Sialkot
        </p>
      </div>

      {/* Story */}
      <section style={{ padding: "22px 18px 0" }}>
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
          Three generations of wood,{" "}
          <span style={{ fontStyle: "italic", color: "#23402F" }}>
            joined by hand.
          </span>
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "14px",
            fontSize: "15px",
            lineHeight: 1.65,
            color: "#3D3A36",
          }}
        >
          <p style={{ margin: 0 }}>
            {settings.aboutStory ||
              "CH Furniture began in a small Sialkot workshop with a simple belief: furniture should be built to outlive trends. Today we craft premium wooden furniture for clients across Pakistan and beyond."}
          </p>
          <p style={{ margin: 0 }}>
            {settings.aboutMission ||
              "Every piece is made from carefully seasoned hardwood and finished by hand. Our craftsmen combine traditional joinery and hand-carving with modern design."}
          </p>
        </div>
      </section>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          margin: "22px 16px 0",
          borderTop: "1px solid #1A1A1A",
          borderBottom: "1px solid #E8E4DE",
        }}
      >
        {[
          { n: `${settings.yearsExperience ?? 15}+`, label: "Years making" },
          { n: `${settings.projectsCompleted ?? 1200}+`, label: "Pieces built" },
          { n: `${settings.happyClients ?? 800}+`, label: "Happy clients" },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "14px 6px",
              textAlign: "center",
              borderLeft: i > 0 ? "1px solid #E8E4DE" : "0",
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                fontWeight: 600,
                fontSize: "30px",
                color: "#23402F",
              }}
            >
              {s.n}
            </div>
            <div style={{ marginTop: "2px", fontSize: "11.5px", fontWeight: 700, color: "#3D3A36" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* How we build */}
      <section style={{ padding: "26px 16px 0" }}>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
            fontWeight: 500,
            fontSize: "24px",
          }}
        >
          How we build
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "8px",
            marginTop: "12px",
          }}
        >
          {VALUES.map((v) => (
            <div
              key={v.title}
              style={{
                padding: "16px 14px",
                borderRadius: "16px",
                background: v.bg,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={v.ink}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={v.icon} />
              </svg>
              <div style={{ marginTop: "10px", fontSize: "14px", fontWeight: 700 }}>
                {v.title}
              </div>
              <div
                style={{
                  marginTop: "3px",
                  fontSize: "12.5px",
                  lineHeight: 1.45,
                  color: "#3D3A36",
                }}
              >
                {v.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "22px 16px 0",
        }}
      >
        <Link
          href="/contact"
          style={{
            height: "54px",
            borderRadius: "27px",
            background: "#1A1A1A",
            color: "#FFFFFF",
            fontSize: "13.5px",
            fontWeight: 700,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          Visit the workshop →
        </Link>
        <Link
          href="/categories"
          style={{
            height: "54px",
            borderRadius: "27px",
            border: "1.5px solid #1A1A1A",
            color: "#1A1A1A",
            fontSize: "13.5px",
            fontWeight: 700,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          Browse collections
        </Link>
      </div>

      <div style={{ height: "40px" }} />
    </MobileInnerLayout>
  );
}
