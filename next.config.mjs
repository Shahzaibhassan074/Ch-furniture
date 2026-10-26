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
      { source: "/category/beds/beds-mfFyocD9", destination: "/category/beds/elegant-handcrafted-bed-with-premium-cushion-work", permanent: true },
      { source: "/category/beds/beds-RX7Mg0Z5", destination: "/category/beds/elegant-handcrafted-bed-with-premium-cushion-work-2", permanent: true },
      { source: "/category/beds/beds-mdFWSstj", destination: "/category/beds/elegant-handcrafted-bed-with-premium-cushion-work-3", permanent: true },
      { source: "/category/beds/beds-efi-aJ-0", destination: "/category/beds/luxury-handcrafted-bed-with-premium-cushion-work", permanent: true },
      { source: "/category/beds/beds-N2r-kJCX", destination: "/category/beds/traditional-handcrafted-bed-with-premium-cushion-work", permanent: true },
      { source: "/category/beds/beds-j-8NLn08", destination: "/category/beds/premium-handcrafted-bed-with-premium-cushion-work", permanent: true },
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
