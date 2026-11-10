import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Matches exactly /category/<catSlug>/<productSlug> — no more, no fewer segments.
const PRODUCT_RE = /^\/category\/([^/]+)\/([^/]+)$/;

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

type ProductInfo = { active: boolean; categorySlug: string | null };

async function getProductInfo(productSlug: string): Promise<ProductInfo | null> {
  // Anon (public) key only — read-only, obeys RLS, never the service-role key.
  // If the key is absent (misconfigured env), fail open so users are never blocked.
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!apiKey) return null;

  try {
    const url =
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products` +
      `?slug=eq.${encodeURIComponent(productSlug)}` +
      `&select=is_active,categories(slug)` +
      `&limit=1`;
    const res = await fetch(url, { headers: { apikey: apiKey } });

    // Network / Supabase error — fail open so a DB outage never blocks users.
    if (!res.ok) return null;

    const data = await res.json();

    // Product genuinely not in the database — treat as inactive.
    if (!Array.isArray(data) || data.length === 0) {
      return { active: false, categorySlug: null };
    }

    const row = data[0];
    return {
      active: row.is_active === true,
      categorySlug: row.categories?.slug ?? null,
    };
  } catch {
    // Any unexpected error — fail open.
    return null;
  }
}

export default withAuth(
  async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const m = PRODUCT_RE.exec(pathname);
    if (m) {
      const [, urlCatSlug, productSlug] = m;
      const info = await getProductInfo(productSlug);

      // DB unreachable — fail open; let the page render its own 404.
      if (info === null) return NextResponse.next();

      // Product deleted / unpublished (or never existed).
      if (!info.active) {
        return new NextResponse(NOT_FOUND_HTML, {
          status: 404,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }

      // Product exists but is filed under a different category — 301 to canonical URL.
      if (info.categorySlug && info.categorySlug !== urlCatSlug) {
        const canonical = new URL(
          `/category/${info.categorySlug}/${productSlug}`,
          request.url,
        );
        return NextResponse.redirect(canonical, 301);
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
  },
);

export const config = {
  matcher: [
    // Admin protection (unchanged)
    "/admin",
    "/admin/((?!login|forgot-password|reset-password).*)",
    // Runs for all /category/… paths; PRODUCT_RE inside the handler restricts
    // the DB check to exactly /category/<cat>/<product> (2 segments only).
    "/category/:path+",
  ],
};
