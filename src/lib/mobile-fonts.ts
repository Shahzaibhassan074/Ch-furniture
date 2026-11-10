import { Playfair_Display, Manrope } from "next/font/google";

export const mPlayfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-m-display",
  display: "swap",
  preload: false,
});

export const mManrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-m-body",
  display: "swap",
  preload: false,
});
