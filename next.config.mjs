/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: false },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "mutdqybilhpwxhextcbl.supabase.co" },
    ],
    // deviceSizes / imageSizes tell Next.js which widths to request;
    // our loader injects them into the Cloudinary URL.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 64, 128, 256, 384],
  },
  experimental: { optimizePackageImports: ["lucide-react"] },
  async redirects() {
    return [
      // www → non-www permanent 301 redirect
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.chfurniturehouse.com" }],
        destination: "https://chfurniturehouse.com/:path*",
        permanent: true,
      },

      // ── A: Product slug renames (old slug → new live slug) ─────────────────
      { source: "/category/double-bed/classical-double-bed",                       destination: "/category/double-bed",                                             permanent: true }, // renamed to wooden-bunk-bed, then deleted
      { source: "/category/wardrobes/custom-build-wardrobe",                       destination: "/category/wardrobes/dark-3-door-wardrobe-with-mirror",             permanent: true },
      { source: "/category/dining/elegant-and-clean-dining-set",                   destination: "/category/dining/glass-top-4-seater-dining-set",                   permanent: true },
      { source: "/category/dining/fine-closure-dining-set",                        destination: "/category/dining/space-saving-oval-dining-set",                    permanent: true },
      { source: "/category/sofas/fully-premium-lougde-set",                        destination: "/category/sofas/premium-carved-lounge-set",                        permanent: true },
      { source: "/category/beds/girly-single-bed",                                 destination: "/category/beds/pink-velvet-girls-single-bed",                      permanent: true },
      { source: "/category/beds/grey-cushion-single-bed",                          destination: "/category/beds/sage-velvet-wingback-single-bed",                   permanent: true },
      { source: "/category/beds/hand-crafted-bed-with-white-cushioning",           destination: "/category/beds/ivory-tufted-luxury-king-bed",                      permanent: true },
      { source: "/category/sofas/king-size-sofa-set",                              destination: "/category/sofas/king-size-chesterfield-sofa",                      permanent: true },
      { source: "/category/chairs/long-head-wooden-bed-room-chairs",               destination: "/category/chairs/high-back-carved-bedroom-chairs",                 permanent: true },
      { source: "/category/wardrobes/luxuary-full-wall-wardrobe",                  destination: "/category/wardrobes/luxury-full-wall-wardrobe-with-dressing-table", permanent: true },
      { source: "/category/beds/modern-single-bed",                                destination: "/category/beds/white-single-daybed",                               permanent: true },
      { source: "/category/tables/modern-table",                                   destination: "/category/tables/white-french-console-table",                      permanent: true },
      { source: "/category/beds/premium-handcrafted-bed-with-premium-cushion-work", destination: "/category/beds/modren-wooden-bed",                                permanent: true },
      { source: "/category/dewan/prince-dewan-set",                                destination: "/category/dewan/prince-dewan",                                     permanent: true },
      { source: "/category/beds/simple-and-clean-wooden-single-bed",               destination: "/category/beds/black-wooden-single-bed-with-drawers",              permanent: true },
      { source: "/category/beds/single-bed",                                       destination: "/category/beds/navy-tufted-single-bed",                            permanent: true },
      { source: "/category/chairs/sleek-modern-bedroom-chair",                     destination: "/category/chairs/caramel-tufted-bedroom-chairs",                   permanent: true },
      { source: "/category/tables/white-wooden-table",                             destination: "/category/tables/whitewashed-carved-console-table",                permanent: true },
      { source: "/category/double-bed/wooden-double-bed",                          destination: "/category/double-bed/bunk-bed-with-staircase-drawers",             permanent: true },
      { source: "/category/tables/wooden-polish-table",                            destination: "/category/tables/dark-wood-console-table",                         permanent: true },
      { source: "/category/tables/wooden-tea-table",                               destination: "/category/tables/traditional-wooden-tea-trolley",                  permanent: true },
      { source: "/category/double-bed/wooden-work-double-bed",                     destination: "/category/double-bed/natural-wood-bunk-bed",                       permanent: true },

      // ── B: Deleted products → their category page ──────────────────────────
      { source: "/category/double-bed/wooden-bunk-bed",         destination: "/category/double-bed",   permanent: true },
      { source: "/category/full-bed-set/bed-sets",              destination: "/category/beds",         permanent: true },
      { source: "/category/chairs/classical-bed-room-chairs",   destination: "/category/chairs",       permanent: true },
      { source: "/category/chairs/grace-classy-wooden-chair",   destination: "/category/chairs",       permanent: true },
      { source: "/category/dewan/clean-and-elegant-dewan-set",  destination: "/category/dewan",        permanent: true },
      { source: "/category/dewan/ivory-tufted-chaise-dewan",    destination: "/category/dewan",        permanent: true },
      { source: "/category/dewan/raja-dewan",                   destination: "/category/dewan",        permanent: true },
      { source: "/category/beds/grey-upholstered-headboard-bed", destination: "/category/beds",        permanent: true },
      { source: "/category/beds/noor-mahal-bed",                destination: "/category/beds",         permanent: true },
      { source: "/category/beds/wooden-single-bed",             destination: "/category/beds",         permanent: true },
      { source: "/category/tables/home-decor-table",            destination: "/category/tables",       permanent: true },
      { source: "/category/sofas/l-shaped-corner-sofa",         destination: "/category/sofas",        permanent: true },
      { source: "/category/sofas/royal-carved-tufted-sofa",     destination: "/category/sofas",        permanent: true },

      // ── Old typo-slug → current slug (batch 1, Oct 2026) ───────────────────
      // imran-khan-sofa: was → royal-carved-tufted-sofa (now deleted → /category/sofas)
      { source: "/category/sofas/imran-khan-sofa",                      destination: "/category/sofas",                           permanent: true },
      { source: "/category/sofas/modren-cushion-sofa",                  destination: "/category/sofas/modern-cushion-sofa",        permanent: true },
      { source: "/category/sofas/modren-cushion",                       destination: "/category/sofas/modern-cushion-sofa-set",    permanent: true },
      // modren-single-bed: was → modern-single-bed (now renamed → white-single-daybed)
      { source: "/category/beds/modren-single-bed",                     destination: "/category/beds/white-single-daybed",         permanent: true },
      { source: "/category/sofas/sleek-and-elgenant-with-modren-touch", destination: "/category/sofas/sleek-elegant-modern-sofa",  permanent: true },

      // ── Old typo-slug → current slug (batch 2, Oct 2026) ───────────────────
      { source: "/category/:cat/modren-dinning-set",           destination: "/category/:cat/modern-dining-set",               permanent: true },
      { source: "/category/:cat/ppc-modren-wardrobe",          destination: "/category/:cat/ppc-modern-wardrobe",             permanent: true },
      { source: "/category/:cat/modren-dewan-set",             destination: "/category/:cat/modern-dewan-set",                permanent: true },
      { source: "/category/:cat/modren-full-wall-wardrobe",    destination: "/category/:cat/modern-full-wall-wardrobe",       permanent: true },
      { source: "/category/:cat/ppc-modren-full-wall-wardrobe", destination: "/category/:cat/ppc-modern-full-wall-wardrobe",  permanent: true },
      { source: "/category/:cat/modren-4-chair-dining-table",  destination: "/category/:cat/modern-4-chair-dining-table",    permanent: true },
      // modren-table: was → :cat/modern-table (now renamed → white-french-console-table)
      { source: "/category/:cat/modren-table",                 destination: "/category/tables/white-french-console-table",   permanent: true },
      // sleek-and-modren-bedroom-chair: was → :cat/sleek-modern-bedroom-chair (now renamed → caramel-tufted-bedroom-chairs)
      { source: "/category/:cat/sleek-and-modren-bedroom-chair", destination: "/category/chairs/caramel-tufted-bedroom-chairs", permanent: true },
      // blue-modren-dewan-set: was → ivory-tufted-chaise-dewan (now deleted → /category/dewan)
      { source: "/category/:cat/blue-modren-dewan-set",        destination: "/category/dewan",                               permanent: true },
      { source: "/category/:cat/modren-long-wall-bed",         destination: "/category/:cat/modern-long-wall-bed",           permanent: true },

      // ── Duplicate bed renames / random DB-suffix slugs ─────────────────────
      { source: "/category/beds/elegant-handcrafted-bed-with-premium-cushion-work",   destination: "/category/beds/wooden-single-bed-with-storage-base",         permanent: true },
      { source: "/category/beds/elegant-handcrafted-bed-with-premium-cushion-work-2", destination: "/category/beds/mid-century-walnut-headboard-bed",             permanent: true },
      // -work-3: was → grey-upholstered-headboard-bed (now deleted → /category/beds)
      { source: "/category/beds/elegant-handcrafted-bed-with-premium-cushion-work-3", destination: "/category/beds",                                             permanent: true },
      { source: "/category/beds/beds-mfFyocD9", destination: "/category/beds/wooden-single-bed-with-storage-base",         permanent: true },
      { source: "/category/beds/beds-RX7Mg0Z5", destination: "/category/beds/mid-century-walnut-headboard-bed",             permanent: true },
      // beds-mdFWSstj: was → grey-upholstered-headboard-bed (now deleted → /category/beds)
      { source: "/category/beds/beds-mdFWSstj",  destination: "/category/beds",                                             permanent: true },
      { source: "/category/beds/beds-efi-aJ-0",  destination: "/category/beds/luxury-handcrafted-bed-with-premium-cushion-work",      permanent: true },
      { source: "/category/beds/beds-N2r-kJCX",  destination: "/category/beds/traditional-handcrafted-bed-with-premium-cushion-work", permanent: true },
      // beds-j-8NLn08: was → premium-handcrafted-...-work (now renamed → modren-wooden-bed)
      { source: "/category/beds/beds-j-8NLn08",  destination: "/category/beds/modren-wooden-bed",                          permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      // Ensure admin pages are never cached by CDN
      {
        source: "/admin/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      // Long cache for static assets
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};
export default nextConfig;
