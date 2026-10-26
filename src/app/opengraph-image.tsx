import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CH Furniture House — Premium Wooden Furniture, Sialkot Pakistan";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAF7F4",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            background: "#1C1A18",
            borderRadius: "16px",
            marginBottom: "32px",
          }}
        >
          <span style={{ color: "#E76A2F", fontSize: "32px", fontWeight: "800" }}>CH</span>
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: "60px",
            fontWeight: "800",
            color: "#1C1A18",
            letterSpacing: "-2px",
            textAlign: "center",
          }}
        >
          CH Furniture House
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "26px",
            color: "#6B6560",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          Premium Handcrafted Wooden Furniture · Sialkot, Pakistan
        </div>

        {/* Accent bar */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "#E76A2F",
            borderRadius: "2px",
            marginTop: "40px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
