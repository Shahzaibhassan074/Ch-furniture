/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "mutdqybilhpwxhextcbl.supabase.co" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [32, 64, 96, 128, 256],
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
      // Old random-suffix product slugs → new readable slugs
      // Product slug fixes batch 1 (2026-10)
      { source: "/category/sofas/imran-khan-sofa",                      destination: "/category/sofas/royal-carved-tufted-sofa",       permanent: true },
      { source: "/category/sofas/modren-cushion-sofa",                  destination: "/category/sofas/modern-cushion-sofa",             permanent: true },
      { source: "/category/sofas/modren-cushion",                       destination: "/category/sofas/modern-cushion-sofa-set",         permanent: true },
      { source: "/category/beds/modren-single-bed",                     destination: "/category/beds/modern-single-bed",               permanent: true },
      { source: "/category/sofas/sleek-and-elgenant-with-modren-touch", destination: "/category/sofas/sleek-elegant-modern-sofa",      permanent: true },
      // Product slug fixes batch 2 (2026-10) — :cat wildcard covers any category
      { source: "/category/:cat/modren-dinning-set",                    destination: "/category/:cat/modern-dining-set",               permanent: true },
      { source: "/category/:cat/ppc-modren-wardrobe",                   destination: "/category/:cat/ppc-modern-wardrobe",             permanent: true },
      { source: "/category/:cat/modren-dewan-set",                      destination: "/category/:cat/modern-dewan-set",                permanent: true },
      { source: "/category/:cat/modren-full-wall-wardrobe",             destination: "/category/:cat/modern-full-wall-wardrobe",       permanent: true },
      { source: "/category/:cat/ppc-modren-full-wall-wardrobe",         destination: "/category/:cat/ppc-modern-full-wall-wardrobe",   permanent: true },
      { source: "/category/:cat/modren-4-chair-dining-table",           destination: "/category/:cat/modern-4-chair-dining-table",     permanent: true },
      { source: "/category/:cat/modren-table",                          destination: "/category/:cat/modern-table",                   permanent: true },
      { source: "/category/:cat/sleek-and-modren-bedroom-chair",        destination: "/category/:cat/sleek-modern-bedroom-chair",      permanent: true },
      { source: "/category/:cat/blue-modren-dewan-set",                 destination: "/category/:cat/ivory-tufted-chaise-dewan",       permanent: true },
      { source: "/category/:cat/modren-long-wall-bed",                  destination: "/category/:cat/modern-long-wall-bed",            permanent: true },
      // Duplicate bed renames — direct to final slug
      { source: "/category/beds/elegant-handcrafted-bed-with-premium-cushion-work",   destination: "/category/beds/wooden-single-bed-with-storage-base", permanent: true },
      { source: "/category/beds/elegant-handcrafted-bed-with-premium-cushion-work-2", destination: "/category/beds/mid-century-walnut-headboard-bed",    permanent: true },
      { source: "/category/beds/elegant-handcrafted-bed-with-premium-cushion-work-3", destination: "/category/beds/grey-upholstered-headboard-bed",      permanent: true },
      // Old random-suffix bed slugs → final readable slugs (skip intermediate)
      { source: "/category/beds/beds-mfFyocD9", destination: "/category/beds/wooden-single-bed-with-storage-base",       permanent: true },
      { source: "/category/beds/beds-RX7Mg0Z5", destination: "/category/beds/mid-century-walnut-headboard-bed",          permanent: true },
      { source: "/category/beds/beds-mdFWSstj",  destination: "/category/beds/grey-upholstered-headboard-bed",           permanent: true },
      { source: "/category/beds/beds-efi-aJ-0",  destination: "/category/beds/luxury-handcrafted-bed-with-premium-cushion-work",      permanent: true },
      { source: "/category/beds/beds-N2r-kJCX",  destination: "/category/beds/traditional-handcrafted-bed-with-premium-cushion-work", permanent: true },
      { source: "/category/beds/beds-j-8NLn08",  destination: "/category/beds/premium-handcrafted-bed-with-premium-cushion-work",     permanent: true },
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
