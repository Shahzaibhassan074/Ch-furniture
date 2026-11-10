"use client";

import { useState } from "react";
import Link from "next/link";
import { mPlayfair, mManrope } from "@/lib/mobile-fonts";
import {
  FavouritesProvider,
  useFavourites,
} from "@/context/favourites-context";
import { MobileDrawerMenu } from "./MobileDrawerMenu";
import { MobileBottomSheet } from "./MobileBottomSheet";
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
};

function MobileLayoutInner({ settings, categories, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
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

      {/* Sticky header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,.97)",
          borderBottom: "1px solid #E8E4DE",
          padding: "10px 12px 12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => { setSavedOpen(false); setDrawerOpen(true); }}
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
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M3 12h18M3 18h12" />
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/"
            aria-label="CH Furniture House home"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: 1,
              textDecoration: "none",
              color: "#1A1A1A",
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                fontWeight: 600,
                fontSize: "21px",
                letterSpacing: ".3px",
              }}
            >
              CH Furniture House
            </span>
            <span
              style={{
                marginTop: "3px",
                fontSize: "9.5px",
                fontWeight: 700,
                letterSpacing: "2.6px",
                textTransform: "uppercase",
                color: "#A64A25",
              }}
            >
              Handcrafted · Sialkot
            </span>
          </Link>

          {/* Heart with badge */}
          <button
            aria-label={`Saved pieces${count > 0 ? `, ${count} items` : ""}`}
            onClick={() => { setDrawerOpen(false); setSavedOpen(true); }}
            style={{
              position: "relative",
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
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={count > 0 ? "#B3261E" : "none"}
              stroke="#1A1A1A"
              strokeWidth="1.9"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
            </svg>
            {count > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "2px",
                  minWidth: "18px",
                  height: "18px",
                  borderRadius: "9px",
                  background: "#B3261E",
                  color: "#FFFFFF",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  boxSizing: "border-box",
                }}
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>
        </div>

        {/* Search pill — inside sticky header */}
        <Link
          href="/search"
          style={{
            marginTop: "8px",
            height: "46px",
            borderRadius: "23px",
            background: "#F5F3EF",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0 16px",
            color: "#5F5A54",
            fontSize: "14.5px",
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
          What are you looking for?
        </Link>
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

      {/* Drawer */}
      {drawerOpen && (
        <MobileDrawerMenu
          categories={categories}
          whatsapp={settings.whatsapp}
          phone={settings.phone}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      {/* Saved sheet */}
      {savedOpen && (
        <MobileBottomSheet
          type="saved"
          whatsapp={settings.whatsapp}
          onClose={() => setSavedOpen(false)}
        />
      )}
    </div>
  );
}

export function MobileLayout({ settings, categories, children }: Props) {
  return (
    <FavouritesProvider>
      <MobileLayoutInner settings={settings} categories={categories}>
        {children}
      </MobileLayoutInner>
    </FavouritesProvider>
  );
}
