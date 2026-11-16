import localFont from "next/font/local";

// Self-hosted (src/fonts) so the build never depends on Google Fonts.
export const mPlayfair = localFont({
  src: [
    { path: "../fonts/playfair-latin.woff2", weight: "500 600", style: "normal" },
    { path: "../fonts/playfair-italic-latin.woff2", weight: "500 600", style: "italic" },
  ],
  variable: "--font-m-display",
  display: "swap",
  preload: false,
});

export const mManrope = localFont({
  src: "../fonts/manrope-latin.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-m-body",
  display: "swap",
  preload: false,
});
