"use client";

import { useState } from "react";
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
  email?: string;
};

type Category = {
  slug: string;
  name: string;
  thumbUrl: string | null;
  count: number;
};

type Props = { settings: Settings; categories: Category[] };

function ContactForm({ phone }: { phone: string }) {
  const [phase, setPhase] = useState<"form" | "sending" | "sent">("form");
  const [name, setName] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhase("sending");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phoneVal, email, message }),
      });
    } catch {
      // best-effort
    }
    setPhase("sent");
  }

  const inputStyle: React.CSSProperties = {
    height: "50px",
    borderRadius: "12px",
    border: "1.5px solid #D9D4CC",
    background: "#FFFFFF",
    padding: "0 14px",
    fontFamily: "Manrope, sans-serif",
    fontSize: "16px",
    color: "#1A1A1A",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: ".4px",
    color: "#3D3A36",
  };

  if (phase === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "12px 0 6px" }}>
        <span
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "34px",
            background: "#23402F",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D9B877"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        </span>
        <h2
          style={{
            margin: "14px 0 0",
            fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
            fontWeight: 500,
            fontSize: "23px",
          }}
        >
          Thank you — message sent
        </h2>
        <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: 1.5, color: "#5F5A54" }}>
          We&apos;ll be in touch shortly.
        </p>
        <button
          onClick={() => { setPhase("form"); setName(""); setPhoneVal(""); setEmail(""); setMessage(""); }}
          style={{
            marginTop: "14px",
            height: "44px",
            padding: "0 20px",
            borderRadius: "22px",
            border: "1.5px solid #1A1A1A",
            background: "transparent",
            fontFamily: "Manrope, sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "#1A1A1A",
            cursor: "pointer",
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <>
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
          fontWeight: 500,
          fontSize: "23px",
        }}
      >
        Send us a note
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "14px" }}
      >
        <label style={labelStyle}>
          Your name *
          <input
            name="name"
            required
            placeholder="e.g. Ayesha Khan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Phone
          <input
            name="phone"
            type="tel"
            placeholder="+92 3xx xxxxxxx"
            value={phoneVal}
            onChange={(e) => setPhoneVal(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Email
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          What are you looking for? *
          <textarea
            name="message"
            required
            rows={4}
            placeholder="A 6-seater dining set in walnut…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              borderRadius: "12px",
              border: "1.5px solid #D9D4CC",
              background: "#FFFFFF",
              padding: "12px 14px",
              fontFamily: "Manrope, sans-serif",
              fontSize: "16px",
              color: "#1A1A1A",
              resize: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </label>
        <button
          type="submit"
          disabled={phase === "sending"}
          style={{
            height: "54px",
            borderRadius: "27px",
            border: 0,
            background: "#1A1A1A",
            color: "#FFFFFF",
            fontFamily: "Manrope, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            cursor: "pointer",
            opacity: phase === "sending" ? 0.7 : 1,
          }}
        >
          {phase === "sending" && (
            <span
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "9px",
                border: "2.5px solid rgba(255,255,255,.3)",
                borderTopColor: "#D9B877",
                boxSizing: "border-box",
                animation: "m-spin 0.8s linear infinite",
                display: "inline-block",
              }}
            />
          )}
          {phase === "sending" ? "Sending…" : "Send message"}
        </button>
      </form>
    </>
  );
}

export function MobileContact({ settings, categories }: Props) {
  const digits = settings.whatsapp.replace(/\D/g, "");
  const waGeneral = `https://wa.me/${digits}?text=${encodeURIComponent(
    "Hello CH FURNITURE, I would like to know more about your furniture."
  )}`;
  const phone = settings.phone || "+92 341 6309652";
  const email = (settings as { email?: string }).email || "hshahzaib651@gmail.com";

  return (
    <MobileInnerLayout
      settings={settings}
      categories={categories}
      backHref="/"
      backLabel="Back to home"
      title="Visit & contact"
      subtitle="We reply within the day"
      rightSlot={
        <Link
          href="/"
          aria-label="Home"
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
            <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
          </svg>
        </Link>
      }
    >
      {/* Intro */}
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
          Let&apos;s craft your{" "}
          <span style={{ fontStyle: "italic" }}>next piece</span>
        </p>
        <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: 1.55, color: "#5F5A54" }}>
          WhatsApp is the fastest way to reach us — we reply with pricing, wood
          options and timelines.
        </p>
      </section>

      {/* Contact card */}
      <div
        style={{
          margin: "18px 16px 0",
          borderRadius: "18px",
          background: "#FFFFFF",
          border: "1px solid #E8E4DE",
          boxShadow: "0 18px 36px -28px rgba(0,0,0,.45)",
          overflow: "hidden",
        }}
      >
        {/* Card header */}
        <div
          style={{
            padding: "12px 14px 10px",
            background: "#F5F3EF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#23402F" }}>
            Talk to the workshop
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", fontWeight: 700, color: "#1B7F45" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "4px", background: "#1B7F45", display: "inline-block" }} />
            Mon–Sat · 9–8
          </span>
        </div>

        {/* WhatsApp row */}
        <a
          href={waGeneral}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 14px 14px 12px", borderBottom: "1px solid #E8E4DE", textDecoration: "none" }}
        >
          <span
            style={{
              flex: "0 0 auto",
              width: "48px",
              height: "48px",
              borderRadius: "24px",
              background: "#1B7F45",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 18px -10px #1B7F45",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" />
            </svg>
          </span>
          <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <span style={{ display: "block", fontSize: "15.5px", fontWeight: 700, color: "#1A1A1A" }}>Chat on WhatsApp</span>
            <span style={{ display: "block", marginTop: "2px", fontSize: "12.5px", color: "#5F5A54" }}>Fastest reply · photos, prices, timelines</span>
          </span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M8 7h9v9" />
          </svg>
        </a>

        {/* Call row */}
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 14px 14px 12px", borderBottom: "1px solid #E8E4DE", textDecoration: "none" }}
        >
          <span
            style={{
              flex: "0 0 auto",
              width: "48px",
              height: "48px",
              borderRadius: "24px",
              background: "#1A1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D9B877" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
            </svg>
          </span>
          <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <span style={{ display: "block", fontSize: "15.5px", fontWeight: 700, color: "#1A1A1A" }}>Call us</span>
            <span style={{ display: "block", marginTop: "2px", fontSize: "12.5px", color: "#5F5A54" }}>{phone}</span>
          </span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M8 7h9v9" />
          </svg>
        </a>

        {/* Directions row */}
        <a
          href="https://www.google.com/maps?q=Kalaswala%2C+Pasrur%2C+Sialkot"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 14px 14px 12px", textDecoration: "none" }}
        >
          <span
            style={{
              flex: "0 0 auto",
              width: "48px",
              height: "48px",
              borderRadius: "24px",
              background: "#1A73E8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 11l18-8-8 18-2-8z" />
            </svg>
          </span>
          <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <span style={{ display: "block", fontSize: "15.5px", fontWeight: 700, color: "#1A1A1A" }}>Get directions</span>
            <span style={{ display: "block", marginTop: "2px", fontSize: "12.5px", color: "#5F5A54" }}>Kalaswala, Pasrur, Sialkot · Google Maps</span>
          </span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M8 7h9v9" />
          </svg>
        </a>
      </div>

      {/* Map placeholder */}
      <a
        href="https://www.google.com/maps?q=Kalaswala%2C+Pasrur%2C+Sialkot"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          margin: "12px 16px 0",
          height: "190px",
          borderRadius: "16px",
          background: "#F1F3F4",
          position: "relative",
          overflow: "hidden",
          display: "block",
          boxShadow: "inset 0 0 0 1px #DADCE0",
          textDecoration: "none",
        }}
        aria-label="Open the workshop location in Google Maps"
      >
        {/* Simple decorative map SVG */}
        <svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%" viewBox="0 0 358 190" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="358" height="190" fill="#F1F3F4" />
          <path d="M-10 0H120C110 30 90 45 60 52S-10 70-10 70z" fill="#AADAFF" />
          <rect x="232" y="18" width="96" height="56" rx="10" fill="#CEEAD6" />
          <rect x="24" y="96" width="70" height="44" rx="6" fill="#E8EAED" />
          <rect x="254" y="112" width="80" height="40" rx="6" fill="#E8EAED" />
          <path d="M-10 128C60 108 110 148 180 118S300 68 370 88" stroke="#DADCE0" strokeWidth="16" />
          <path d="M-10 128C60 108 110 148 180 118S300 68 370 88" stroke="#FDE293" strokeWidth="11" />
        </svg>
        <span style={{ position: "absolute", left: "50%", top: "32px", marginLeft: "-18px" }}>
          <svg width="36" height="46" viewBox="0 0 24 30" aria-hidden="true">
            <path d="M12 29s9-9.2 9-16a9 9 0 0 0-18 0c0 6.8 9 16 9 16z" fill="#EA4335" />
            <circle cx="12" cy="12" r="3.6" fill="#B31412" />
          </svg>
        </span>
        <span
          style={{
            position: "absolute",
            left: "10px",
            right: "10px",
            bottom: "10px",
            background: "#FFFFFF",
            borderRadius: "14px",
            padding: "9px 10px 9px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 2px 6px rgba(60,64,67,.25)",
          }}
        >
          <span style={{ flex: 1, minWidth: 0, fontSize: "12px", lineHeight: 1.35, fontWeight: 600, color: "#202124" }}>
            Mohala Sardaaran, Near HBL Bank, Kalaswala, Pasrur, Sialkot
          </span>
          <span
            style={{
              flex: "0 0 auto",
              height: "34px",
              padding: "0 12px",
              borderRadius: "17px",
              background: "#1A73E8",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
            }}
          >
            Open Maps
          </span>
        </span>
      </a>

      {/* Hours + email */}
      <div
        style={{
          margin: "12px 16px 0",
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "8px",
        }}
      >
        <div style={{ background: "#EAF0EB", borderRadius: "16px", padding: "14px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: "#23402F" }}>Open</div>
          <div style={{ marginTop: "4px", fontSize: "15px", fontWeight: 700 }}>Mon–Sat</div>
          <div style={{ fontSize: "13px", color: "#3D3A36" }}>9:00 – 20:00</div>
        </div>
        <a
          href={`mailto:${email}`}
          style={{ background: "#F8ECE5", borderRadius: "16px", padding: "14px", minWidth: 0, textDecoration: "none" }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: "#A64A25" }}>Email</div>
          <div style={{ marginTop: "4px", fontSize: "13px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email}
          </div>
        </a>
      </div>

      {/* Social links */}
      <div style={{ display: "flex", gap: "8px", margin: "12px 16px 0" }}>
        {settings.facebook && (
          <a
            href={settings.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CH Furniture House on Facebook"
            style={{ flex: 1, height: "52px", borderRadius: "26px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px -14px rgba(0,0,0,.6)", background: "#1877F2", textDecoration: "none" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21z" fill="#FFFFFF" />
            </svg>
          </a>
        )}
        {settings.instagram && (
          <a
            href={settings.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CH Furniture House on Instagram"
            style={{ flex: 1, height: "52px", borderRadius: "26px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px -14px rgba(0,0,0,.6)", background: "linear-gradient(45deg,#F58529 0%,#DD2A7B 45%,#8134AF 75%,#515BD4 100%)", textDecoration: "none" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.3" cy="6.7" r=".6" fill="#FFFFFF" />
            </svg>
          </a>
        )}
        {settings.youtube && (
          <a
            href={settings.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CH Furniture House on YouTube"
            style={{ flex: 1, height: "52px", borderRadius: "26px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px -14px rgba(0,0,0,.6)", background: "#FF0000", textDecoration: "none" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="#FFFFFF" />
              <path d="M10.2 9.2v5.6l4.8-2.8z" fill="#FF0000" />
            </svg>
          </a>
        )}
      </div>

      {/* Contact form */}
      <section
        style={{
          margin: "22px 16px 0",
          padding: "22px 18px",
          borderRadius: "16px",
          background: "#F5F3EF",
        }}
      >
        <ContactForm phone={phone} />
      </section>

      <div style={{ height: "40px" }} />
    </MobileInnerLayout>
  );
}
