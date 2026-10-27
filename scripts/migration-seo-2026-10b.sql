-- SEO fixes migration batch 2 — run once in Supabase SQL Editor
-- Prerequisite: migration-seo-2026-10.sql must have been run first.
-- 2026-10

-- ── 1. Modren → Modern renames + remaining typos ────────────────────────────
UPDATE products SET name = 'Modern Dining Set',               slug = 'modern-dining-set'               WHERE slug = 'modren-dinning-set';
UPDATE products SET name = 'PPC Modern Wardrobe',             slug = 'ppc-modern-wardrobe'             WHERE slug = 'ppc-modren-wardrobe';
UPDATE products SET name = 'Modern Dewan Set',                slug = 'modern-dewan-set'                WHERE slug = 'modren-dewan-set';
UPDATE products SET name = 'Modern Full Wall Wardrobe',       slug = 'modern-full-wall-wardrobe'       WHERE slug = 'modren-full-wall-wardrobe';
UPDATE products SET name = 'PPC Modern Full-Wall Wardrobe',   slug = 'ppc-modern-full-wall-wardrobe'   WHERE slug = 'ppc-modren-full-wall-wardrobe';
UPDATE products SET name = 'Modern 4 Chair Dining Table',     slug = 'modern-4-chair-dining-table'     WHERE slug = 'modren-4-chair-dining-table';
UPDATE products SET name = 'Modern Table',                    slug = 'modern-table'                    WHERE slug = 'modren-table';
UPDATE products SET name = 'Sleek Modern Bedroom Chair',      slug = 'sleek-modern-bedroom-chair'      WHERE slug = 'sleek-and-modren-bedroom-chair';
UPDATE products SET name = 'Ivory Tufted Chaise Dewan with Gold Legs', slug = 'ivory-tufted-chaise-dewan' WHERE slug = 'blue-modren-dewan-set';
UPDATE products SET name = 'Modern Long Wall Bed',            slug = 'modern-long-wall-bed'            WHERE slug = 'modren-long-wall-bed';

-- ── 2. Duplicate bed renames ─────────────────────────────────────────────────
UPDATE products SET name = 'Wooden Single Bed with Storage Base', slug = 'wooden-single-bed-with-storage-base'
  WHERE slug = 'elegant-handcrafted-bed-with-premium-cushion-work';
UPDATE products SET name = 'Mid-Century Walnut Headboard Bed',    slug = 'mid-century-walnut-headboard-bed'
  WHERE slug = 'elegant-handcrafted-bed-with-premium-cushion-work-2';
UPDATE products SET name = 'Grey Upholstered Headboard Bed',      slug = 'grey-upholstered-headboard-bed'
  WHERE slug = 'elegant-handcrafted-bed-with-premium-cushion-work-3';

-- ── 3. Title-case sweep ──────────────────────────────────────────────────────
-- Step A: trim trailing/leading whitespace from all product names
UPDATE products SET name = trim(name) WHERE name != trim(name);

-- Step B: fix all-lowercase names (e.g. "raja dewan" → "Raja Dewan")
-- initcap() capitalises the first letter of every word.
-- NOTE: if any product has a name like "ppc table" that should stay with a
--       specific capitalisation, add an explicit UPDATE before this block.
UPDATE products
  SET name = initcap(name)
  WHERE name = lower(name)
    AND length(trim(name)) > 0;

-- Step C: fix all-UPPERCASE names (e.g. "CLASSICAL DEWAN" → "Classical Dewan")
-- Skips single-letter and 2-char values to avoid mangling abbreviations.
-- WARNING: initcap("TV UNIT") → "Tv Unit". If any product is named purely in
--          caps for branding reasons, add an exclusion: AND slug != 'your-slug'
UPDATE products
  SET name = initcap(name)
  WHERE name = upper(name)
    AND length(trim(name)) > 3;

-- ── 4. Verify: show any names that still look wrong after the sweep ──────────
-- Run this SELECT after the UPDATEs to catch any edge cases before refreshing the site.
SELECT id, name, slug
FROM products
WHERE
  name != trim(name)                         -- still has leading/trailing space
  OR (name = lower(name) AND length(name) > 0) -- still all lowercase
  OR (name = upper(name) AND length(name) > 3) -- still all uppercase
ORDER BY name;
