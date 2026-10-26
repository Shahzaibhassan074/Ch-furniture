# SEO Audit Report — CH Furniture House

**Audited:** 2026-10-26  
**Build:** Next.js 14.2.35, Supabase backend  
**Server:** `next start -p 3003` (production build)  
**Lighthouse version:** 13.5.0

---

## Summary

| Task | Status | Critical Issues |
|------|--------|----------------|
| 1. H1 Audit | ⚠️ Warning | Homepage H1 missing from server HTML (SSR disabled on hero) |
| 2. Alt Text Audit | ❌ Needs Work | 90/187 products (48%) missing alt text on images |
| 3. Internal Link Crawl | ✅ Pass | 14 pages crawled, 0 broken HTTP links |
| 4. Lighthouse Scores | ⚠️ Warning | Homepage performance low (42 mobile, 59 desktop) |
| 5. Keyword Cannibalization | ❌ Needs Work | 84/187 products + all 14 categories missing meta titles |
| 6. Content Accuracy | ✅ Fixed | 6 source files corrected (deploys on next push) |

---

## Task 1: H1 Tag Audit

| Page | Server HTML H1s | After JS | Status |
|------|-----------------|----------|--------|
| Homepage (`/`) | 0 | 1 | ⚠️ |
| Categories (`/categories`) | 1 | 1 | ✅ |
| Category (`/category/sofas`) | 1 | 1 | ✅ |
| Product (`/category/sofas/l-shaped-corner-sofa`) | 1 | 1 | ✅ |

**Homepage issue:** The `<h1>` lives inside `HeroSlider`, which is loaded via `dynamic(..., { ssr: false })`. The server renders zero H1 tags; the element only appears after client-side JS executes. Googlebot renders JavaScript before indexing so this is not a blocking problem, but pure-HTML crawlers and feed aggregators will not see a heading.

**Recommended fix:** Either move the H1 outside the dynamic boundary, or add a static visually-hidden H1 as a server-rendered fallback.

---

## Task 2: Alt Text Audit

**Database query across all 187 products:**

| Metric | Count | Percentage |
|--------|-------|-----------|
| Total products | 187 | — |
| Products with `alt: null` on images | 90 | 48% |
| Products with alt text populated | 97 | 52% |

All images are stored in a JSONB `images` column as `[{ url, alt, is_primary, sort_order }]`. Ninety products have `alt: null` on all their image entries, which renders as `alt=""` in the HTML — these images are invisible to screen readers and Google Image Search.

**Fix:** In the admin panel, edit each product and add descriptive alt text for every image. Suggested format: `"[Product Name] — [wood type / finish] — CH Furniture House Sialkot"`. This can also be bulk-updated via Supabase SQL:

```sql
-- Example: set a default alt from product name (adjust as needed)
UPDATE products
SET images = (
  SELECT jsonb_agg(
    img || jsonb_build_object('alt', name)
  )
  FROM jsonb_array_elements(images) AS img
)
WHERE images IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(images) AS img
    WHERE img->>'alt' IS NULL
  );
```

---

## Task 3: Internal Link Crawl

**Crawl scope:** All `<a href>` links from 14 unique pages starting from homepage.

| Metric | Value |
|--------|-------|
| Pages crawled | 14 |
| HTTP 2xx links | All pass |
| False positives | 1 (`tel:` protocol — not an HTTP link) |
| Broken links | 0 |

All internal navigation links resolve correctly. The one "broken link" flagged by the crawler was a `tel:+923XXXXXXXXX` contact link on the contact page — not an HTTP resource and expected to fail HTTP checks.

---

## Task 4: Lighthouse Scores

Tested on production build at `http://localhost:3003`. Only `performance` and `seo` categories were audited.

### Performance

| Page | Device | Perf | SEO | LCP | FCP | TBT | CLS |
|------|--------|------|-----|-----|-----|-----|-----|
| Homepage | Mobile | **42** | 100 | 6.2 s | 1.3 s | 1,550 ms | 0 |
| Homepage | Desktop | **59** | 100 | 4.7 s | 1.1 s | 250 ms | 0 |
| Category (sofas) | Mobile | **92** | 100 | 3.1 s | 1.1 s | 100 ms | 0 |
| Category (sofas) | Desktop | **82** | 100 | 2.9 s | 1.1 s | 40 ms | 0 |
| Product (L-shaped sofa) | Mobile | **90** | 100 | 3.6 s | 1.1 s | 50 ms | 0 |
| Product (L-shaped sofa) | Desktop | **78** | 100 | 3.8 s | 1.1 s | 60 ms | 0 |

**Score ranges:** 0–49 = Poor (red), 50–89 = Needs improvement (orange), 90–100 = Good (green).

### Analysis

- **SEO: 100 on all pages** — metadata, canonical, structured data, and robots rules are correct.
- **CLS: 0 on all pages** — no layout shift, excellent.
- **Homepage is the bottleneck.** Mobile performance of 42 is Poor. The LCP element is the hero slider image, which:
  - Is loaded inside a `dynamic(..., {ssr:false})` component (no server-side preload)
  - Uses a full-resolution image without `priority` or `fetchpriority="high"` on the first slide
  - TBT of 1,550 ms indicates significant main-thread blocking from animation libraries and slider JS
- **Category and product pages are healthy** — mobile scores of 90–92 are in the Good range.

### Recommended homepage fixes

1. Add `priority` prop to the first slide `<Image>` in HeroSlider.
2. Consider enabling SSR on HeroSlider or at minimum rendering the first slide server-side.
3. Audit and defer any non-critical animation JS that runs on initial load.

---

## Task 5: Keyword Cannibalization

### Product meta coverage

| Metric | Count | Percentage |
|--------|-------|-----------|
| Total products | 187 | — |
| Missing `meta_title` | 84 | 45% |
| Missing `meta_description` | 84 | 45% |
| Have both | 103 | 55% |

Products without a `meta_title` fall back to `"[Product Name] | CH Furniture House"` via the layout title template. This is acceptable for uniqueness but misses keyword optimization opportunities.

### Category meta coverage

**All 14 categories are missing `meta_title` and `meta_description`:**

| Category | Slug |
|----------|------|
| Sofas | `sofas` |
| Beds | `beds` |
| Double bed | `double-bed` |
| Full Bed Set | `full-bed-set` |
| Dining | `dining` |
| Chairs | `chairs` |
| Wardrobes | `wardrobes` |
| TV Units | `tv-units` |
| Tables | `tables` |
| Dewan | `dewan` |
| Swings | `swings` |
| Office Furniture | `office-furniture` |
| Carved Furniture | `carved-furniture` |
| Custom Furniture | `custom-furniture` |

Category pages are high-value landing pages for head keywords like "wooden sofas Sialkot". Without custom meta, they rely on auto-generated descriptions that may not target the right keywords.

### True duplicate meta_title

**1 duplicate group found:**

| meta_title | Affected Products |
|------------|------------------|
| `"Elegant Handcrafted Bed with Premium Cushion Work | Chaudhry Furniture House"` | 3 products (identical names) |

These three products compete for the same keyword signal and also contain the old brand name "Chaudhry Furniture House". **Action required:**
1. Give each product a distinct name and unique `meta_title` in the admin panel.
2. Update the `meta_title` to use "CH Furniture House" (not "Chaudhry Furniture House").

---

## Task 6: Content Accuracy

### Fixes applied to source code

The following files have been corrected and will take effect on the next deployment:

| File | Issue | Fix |
|------|-------|-----|
| `src/app/about/page.tsx` | "Chaudhry Furniture House" throughout metadata | → "CH Furniture House" |
| `src/app/categories/page.tsx` | Double-branded title "All Furniture Collections \| CH Furniture House" | → "All Furniture Collections" (layout template appends brand) |
| `src/app/contact/page.tsx` | Double-branded + old format "Contact & Workshop \| CH Furniture House Sialkot" | → "Contact & Workshop — Sialkot" |
| `src/app/search/page.tsx` | Double-branded title "Search \| CH Furniture House" | → "Search" |
| `src/lib/prisma.ts` | Settings fallback `brandName: "CH FURNITURE"` (all-caps) | → `"CH Furniture House"` |
| `src/components/site/WhatsAppLink.tsx` | `"Hello CH FURNITURE,"` in WhatsApp message template | → `"Hello CH Furniture House,"` |

### Remaining content issues (requires manual action)

| Location | Issue | Action |
|----------|-------|--------|
| Supabase `products` table | 3 products have `meta_title` containing "Chaudhry Furniture House" | Edit in admin panel |
| Supabase `settings` table | `brand_name` field may be set to "CH FURNITURE" (all-caps) | Update in Settings admin panel |

---

## Additional Findings

### A. Canonical URLs and robots.txt point to localhost

**Current state:** Canonical tags output `http://localhost:3000/...`; robots.txt sitemap reads `http://localhost:3000/sitemap.xml`.

**Root cause:** The `NEXT_PUBLIC_SITE_URL` environment variable was set to `http://localhost:3000` when the production build was run. Both `src/app/robots.ts` and all page metadata use this variable.

**Fix:** Set `NEXT_PUBLIC_SITE_URL=https://chfurniturehouse.com` in Vercel Project Settings → Environment Variables → Production. Redeploy. This is a blocking SEO issue for production — Google will see canonicals pointing to localhost and may refuse to index the real pages.

### B. Homepage title uses "CH FURNITURE" (all-caps)

The live homepage `<title>` reads: `CH FURNITURE | Premium Wooden Furniture Manufacturer in Sialkot, Pakistan`

This comes from the `brand_name` field in the `settings` table (not the code fallback, which has been fixed). Update it in the admin panel: **Settings → Brand Name → "CH Furniture House"**.

### C. robots.txt does not block `/_next/` static assets

Current disallow list is `/admin` and `/api`. This is correct — `/_next/` should not be disallowed (Googlebot needs JS/CSS to render pages). No action needed.

---

## Priority Action Plan

| Priority | Action | Owner |
|----------|--------|-------|
| 🔴 Blocking | Set `NEXT_PUBLIC_SITE_URL=https://chfurniturehouse.com` in Vercel | DevOps |
| 🔴 Blocking | Update `brand_name` in Settings admin panel → "CH Furniture House" | Admin |
| 🟠 High | Add alt text to 90 products with null alt in images | Content |
| 🟠 High | Write meta_title + meta_description for all 14 categories | Content |
| 🟠 High | Fix 3 duplicate bed products (rename + update meta_title) | Content/Admin |
| 🟡 Medium | Write custom meta for 84 products missing meta_title | Content |
| 🟡 Medium | Fix homepage H1 server-rendering (HeroSlider SSR:false) | Dev |
| 🟡 Medium | Improve homepage performance: add `priority` to hero first image | Dev |
| 🟢 Low | Bulk-update image alt text via SQL (see Task 2 example) | Dev/DB |
