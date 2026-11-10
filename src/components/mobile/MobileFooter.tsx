import Link from "next/link";

type Settings = {
  brandName: string;
  phone: string;
  whatsapp: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
};

type Category = { slug: string; name: string };

type Props = {
  settings: Settings;
  categories: Category[];
};

export function MobileFooter({ settings, categories }: Props) {
  return (
    <footer
      style={{
        background: "#23402F",
        color: "#C9D6CD",
        padding: "32px 20px 32px",
      }}
    >
      {/* Brand */}
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
            color: "#FFFFFF",
            fontSize: "20px",
            fontWeight: 600,
            margin: "0 0 6px",
          }}
        >
          {settings.brandName}
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "#C9D6CD",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Handcrafted Wooden Furniture · Sialkot, Pakistan
        </p>
      </div>

      {/* Phone */}
      <a
        href={`tel:${settings.phone}`}
        style={{
          display: "inline-block",
          color: "#D9B877",
          fontSize: "14px",
          fontWeight: 600,
          textDecoration: "none",
          marginBottom: "20px",
        }}
      >
        {settings.phone}
      </a>

      {/* Category links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 16px",
          marginBottom: "24px",
        }}
      >
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            style={{
              color: "#C9D6CD",
              textDecoration: "none",
              fontSize: "13px",
              padding: "3px 0",
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.1)",
          margin: "0 0 20px",
        }}
      />

      {/* Page links */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {[
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "Delivery", href: "/delivery" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              color: "#C9D6CD",
              fontSize: "12px",
              textDecoration: "none",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Social */}
      {(settings.facebook || settings.instagram || settings.youtube) && (
        <div
          style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
        >
          {settings.facebook && (
            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9D6CD">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          )}
          {settings.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9D6CD"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          )}
          {settings.youtube && (
            <a
              href={settings.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#C9D6CD"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#23402F" />
              </svg>
            </a>
          )}
        </div>
      )}

      <p
        style={{
          fontSize: "11px",
          color: "rgba(201,214,205,0.5)",
          margin: 0,
        }}
      >
        © {new Date().getFullYear()} {settings.brandName}. All rights reserved.
      </p>
    </footer>
  );
}
