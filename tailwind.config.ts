import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Public site: warm cream + terracotta ─────────────────────────────
        cream:      "#F5F0EA", // page background
        parchment:  "#FAF7F4", // card / surface background
        stone:      "#EDE8E1", // footer / alternate section background
        blush:      "#F5C4B2", // tag / badge background
        terra:      "#B5451B", // primary accent (CTAs, highlights, numbers)
        terraLight: "#C85A2E", // terra hover
        ink:        "#1C1A18", // primary text
        inkMuted:   "#8A7F77", // secondary / muted text
        inkBorder:  "#E5DDD5", // borders / dividers
        inkSubtle:  "#F0EAE3", // very subtle tint for numbered items bg

        // ── Admin panel: keep existing dark tokens untouched ─────────────────
        espresso:   "#1A1410",
        bark:       "#2B2118",
        walnut:     "#3D2E20",
        brass:      "#B08D57",
        brassLight: "#C9A876",
        clay:       "#9A7B5F",
        linen:      "#EDE6DA",
        linenDim:   "#C9C0B2",
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        sans:    ["var(--font-sans)",    "Inter",             "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      maxWidth: {
        container: "1360px",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.75rem",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "slide-in-left": {
          "0%":   { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "orbit-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "counter-spin": {
          from: { transform: "translate(-50%, -50%) rotate(var(--ca))" },
          to:   { transform: "translate(-50%, -50%) rotate(calc(var(--ca) - 360deg))" },
        },
      },
      animation: {
        "fade-up":       "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer:         "shimmer 1.6s infinite",
        "slide-in-left": "slide-in-left 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "orbit-spin":    "orbit-spin 40s linear infinite",
        "counter-spin":  "counter-spin 40s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
