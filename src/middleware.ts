import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRODUCT_RE = /^\/category\/[^/]+\/([^/]+)$/;

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Product Not Found | CH Furniture House</title>
<meta name="robots" content="noindex, nofollow">
<style>
  body{font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;
    justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center;background:#FAF8F4;color:#1A1A1A}
  h1{font-size:2rem;margin:0 0 12px}
  p{color:#5F5A54;margin:0 0 24px}
  a{display:inline-block;padding:12px 28px;background:#A64A25;color:#fff;border-radius:9999px;
    text-decoration:none;font-weight:600}
</style>
</head>
<body>
<p style="font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:#A64A25;margin:0 0 8px">Error 404</p>
<h1>Product not found</h1>
<p>This design has been removed or never existed.<br>Browse our collections to find what you need.</p>
<a href="/categories">Browse Collections</a>
</body>
</html>`;

async function isProductActive(slug: string): Promise<boolean> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&is_active=eq.true&select=slug&limit=1`;
    const res = await fetch(url, {
      headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY! },
    });
    if (!res.ok) return true;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0;
  } catch {
    return true;
  }
}

export default withAuth(
  async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const m = PRODUCT_RE.exec(pathname);
    if (m) {
      const active = await isProductActive(m[1]);
      if (!active) {
        return new NextResponse(NOT_FOUND_HTML, {
          status: 404,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      // Admin routes require a valid JWT; product/public routes are always authorized.
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) return !!token;
        return true;
      },
    },
    pages: { signIn: "/admin/login" },
  }
);

export const config = {
  matcher: [
    // Admin protection (unchanged)
    "/admin",
    "/admin/((?!login|forgot-password|reset-password).*)",
    // Product pages — gate deleted/missing slugs before the page renders
    // Use :path+ (one-or-more segments) since Next.js 14 may not support two named params
    "/category/:path+",
  ],
};
