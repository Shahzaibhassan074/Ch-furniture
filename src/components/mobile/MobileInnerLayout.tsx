"use client";

import Link from "next/link";
import { mPlayfair, mManrope } from "@/lib/mobile-fonts";
import {
  FavouritesProvider,
  useFavourites,
} from "@/context/favourites-context";
import { MobileFooter } from "./MobileFooter";
import "@/styles/mobile.css";

type Category = {
  slug: string;
  name: string;
  thumbUrl: string | null;
  count: number;
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
  children: React.ReactNode;
  settings: Settings;
  categories: Category[];
  backHref?: string;
  backLabel?: string;
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  headerExtra?: React.ReactNode;
};

function MobileInnerLayoutInner({
  settings,
  categories,
  children,
  backHref = "/",
  backLabel = "Back",
  title,
  subtitle,
  rightSlot,
  headerExtra,
}: Props) {
  const { count } = useFavourites();
  const digits = settings.whatsapp.replace(/\D/g, "");
  const waGeneral = `https://wa.me/${digits}?text=${encodeURIComponent(
    "Hello CH FURNITURE, I would like to know more about your furniture."
  )}`;

  return (
    <div
      className={`${mPlayfair.variable} ${mManrope.variable}`}
      style={{
        fontFamily: "var(--font-m-body,Manrope,system-ui,sans-serif)",
        background: "#FFFFFF",
        color: "#1A1A1A",
        minHeight: "100vh",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Forest top bar */}
      <div
        style={{
          background: "#23402F",
          height: "34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          fontSize: "11.5px",
          fontWeight: 700,
          color: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        <Link
          href="/contact"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#FFFFFF",
            height: "34px",
            textDecoration: "none",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D9B877"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Visit our workshop, Sialkot
        </Link>
        <span style={{ color: "#D9B877" }}>Mon–Sat 9–8</span>
      </div>

      {/* Inner page sticky header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,.97)",
          borderBottom: "1px solid #E8E4DE",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
          }}
        >
          {/* Back button */}
          <Link
            href={backHref}
            aria-label={backLabel}
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
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>

          {/* Title */}
          <div
            style={{ textAlign: "center", lineHeight: 1.15, minWidth: 0, flex: 1, padding: "0 8px" }}
          >
            <div
              style={{
                fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                fontWeight: 600,
                fontSize: "20px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  marginTop: "2px",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  letterSpacing: "1.4px",
                  textTransform: "uppercase",
                  color: "#A64A25",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Right action */}
          {rightSlot ?? (
            <Link
              href="/search"
              aria-label="Search"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "22px",
                border: "1px solid #E8E4DE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
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
            </Link>
          )}
        </div>
        {headerExtra}
      </header>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <MobileFooter settings={settings} categories={categories} />

      {/* WhatsApp FAB */}
      <a
        href={waGeneral}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: "fixed",
          right: "14px",
          bottom: "18px",
          zIndex: 40,
          height: "54px",
          padding: "0 18px 0 14px",
          borderRadius: "27px",
          background: "#1B7F45",
          color: "#FFFFFF",
          fontSize: "14px",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 10px 24px -8px rgba(27,127,69,.7)",
          textDecoration: "none",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" />
          <path d="M9 10c0 3 2 5 5 5l1.2-1.2-2-1-1 .8c-.8-.4-1.4-1-1.8-1.8l.8-1-1-2z" />
        </svg>
        WhatsApp
      </a>
    </div>
  );
}

export function MobileInnerLayout(props: Props) {
  return (
    <FavouritesProvider>
      <MobileInnerLayoutInner {...props} />
    </FavouritesProvider>
  );
}

export { type Props as MobileInnerLayoutProps };
