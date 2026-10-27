-- SEO fixes migration batch 3 — run once in Supabase SQL Editor
-- Prerequisite: migrations 2026-10.sql and 2026-10b.sql must have been run first.
-- 2026-10

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- a) Clear stale meta_title / meta_description for every renamed product
--    (new name-based fallback will be used by the frontend instead)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UPDATE products
  SET meta_title = NULL, meta_description = NULL
  WHERE slug IN (
    -- batch 1 (migration-seo-2026-10.sql)
    'royal-carved-tufted-sofa',
    'modern-cushion-sofa',
    'modern-cushion-sofa-set',
    'modern-single-bed',
    'sleek-elegant-modern-sofa',
    -- batch 2 (migration-seo-2026-10b.sql)
    'modern-dining-set',
    'ppc-modern-wardrobe',
    'modern-dewan-set',
    'modern-full-wall-wardrobe',
    'ppc-modern-full-wall-wardrobe',
    'modern-4-chair-dining-table',
    'modern-table',
    'sleek-modern-bedroom-chair',
    'ivory-tufted-chaise-dewan',
    'modern-long-wall-bed',
    'wooden-single-bed-with-storage-base',
    'mid-century-walnut-headboard-bed',
    'grey-upholstered-headboard-bed'
  );

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- b) Clear description for renamed products whose description contains
--    outdated marketing copy tied to the old names
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UPDATE products
  SET description = NULL
  WHERE slug IN (
    'royal-carved-tufted-sofa', 'modern-cushion-sofa', 'modern-cushion-sofa-set',
    'modern-single-bed', 'sleek-elegant-modern-sofa',
    'modern-dining-set', 'ppc-modern-wardrobe', 'modern-dewan-set',
    'modern-full-wall-wardrobe', 'ppc-modern-full-wall-wardrobe',
    'modern-4-chair-dining-table', 'modern-table', 'sleek-modern-bedroom-chair',
    'ivory-tufted-chaise-dewan', 'modern-long-wall-bed',
    'wooden-single-bed-with-storage-base', 'mid-century-walnut-headboard-bed',
    'grey-upholstered-headboard-bed'
  )
  AND (
    description ILIKE '%cushion work%'
    OR description ILIKE '%Chaudhry Furniture House%'
    OR description ILIKE '%Pakistan''s top%'
    OR description ILIKE '%best % price%'
    OR description ILIKE '%No.1%'
  );

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- c) Replace "Chaudhry Furniture House" → "CH Furniture House" globally
--    in products (meta_title, meta_description, description, short_desc)
--    and in categories (meta_title, meta_description, description)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UPDATE products
  SET
    meta_title       = REPLACE(meta_title,       'Chaudhry Furniture House', 'CH Furniture House'),
    meta_description = REPLACE(meta_description, 'Chaudhry Furniture House', 'CH Furniture House'),
    description      = REPLACE(description,      'Chaudhry Furniture House', 'CH Furniture House'),
    short_desc       = REPLACE(short_desc,        'Chaudhry Furniture House', 'CH Furniture House')
  WHERE
    meta_title       ILIKE '%Chaudhry Furniture House%'
    OR meta_description ILIKE '%Chaudhry Furniture House%'
    OR description      ILIKE '%Chaudhry Furniture House%'
    OR short_desc       ILIKE '%Chaudhry Furniture House%';

UPDATE categories
  SET
    meta_title       = REPLACE(meta_title,       'Chaudhry Furniture House', 'CH Furniture House'),
    meta_description = REPLACE(meta_description, 'Chaudhry Furniture House', 'CH Furniture House'),
    description      = REPLACE(description,      'Chaudhry Furniture House', 'CH Furniture House')
  WHERE
    meta_title       ILIKE '%Chaudhry Furniture House%'
    OR meta_description ILIKE '%Chaudhry Furniture House%'
    OR description      ILIKE '%Chaudhry Furniture House%';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- d) Remove "free delivery" from categories (meta_description + description)
--    The products table was already cleaned in migration-seo-2026-10.sql.
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UPDATE categories
  SET meta_description = regexp_replace(meta_description, ',?\s*free delivery[^.]*\.?', '', 'ig')
  WHERE meta_description ILIKE '%free delivery%';

UPDATE categories
  SET description = regexp_replace(description, ',?\s*free delivery[^.]*\.?', '', 'ig')
  WHERE description ILIKE '%free delivery%';

-- Clean up any double-spaces left by the removal
UPDATE categories
  SET meta_description = regexp_replace(meta_description, '\s{2,}', ' ', 'g')
  WHERE meta_description ~ '\s{2,}';

UPDATE categories
  SET description = regexp_replace(description, '\s{2,}', ' ', 'g')
  WHERE description ~ '\s{2,}';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- e) List rows that still contain suspect marketing claims — review before
--    going live.  Target: 0 rows after you have reviewed and cleaned them.
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 'product' AS tbl, id, name, slug,
  CASE
    WHEN meta_title       ILIKE '%Pakistan''s top%' THEN 'meta_title: Pakistan''s top'
    WHEN meta_description ILIKE '%Pakistan''s top%' THEN 'meta_description: Pakistan''s top'
    WHEN description      ILIKE '%Pakistan''s top%' THEN 'description: Pakistan''s top'
    WHEN meta_title       ILIKE '%best % price%'    THEN 'meta_title: best … price'
    WHEN meta_description ILIKE '%best % price%'    THEN 'meta_description: best … price'
    WHEN description      ILIKE '%best % price%'    THEN 'description: best … price'
    WHEN meta_title       ILIKE '%No.1%'            THEN 'meta_title: No.1'
    WHEN meta_description ILIKE '%No.1%'            THEN 'meta_description: No.1'
    WHEN description      ILIKE '%No.1%'            THEN 'description: No.1'
    WHEN meta_description ILIKE '%free delivery%'   THEN 'meta_description: free delivery'
    WHEN description      ILIKE '%free delivery%'   THEN 'description: free delivery'
  END AS issue
FROM products
WHERE
  meta_title       ILIKE ANY(ARRAY['%Pakistan''s top%','%best % price%','%No.1%'])
  OR meta_description ILIKE ANY(ARRAY['%Pakistan''s top%','%best % price%','%No.1%','%free delivery%'])
  OR description      ILIKE ANY(ARRAY['%Pakistan''s top%','%best % price%','%No.1%','%free delivery%'])

UNION ALL

SELECT 'category' AS tbl, id, name, slug,
  CASE
    WHEN meta_description ILIKE '%free delivery%' THEN 'meta_description: free delivery'
    WHEN description      ILIKE '%free delivery%' THEN 'description: free delivery'
  END AS issue
FROM categories
WHERE
  meta_description ILIKE '%free delivery%'
  OR description   ILIKE '%free delivery%'

ORDER BY tbl, name;
