-- SEO fixes migration — run once in Supabase SQL Editor
-- 2026-10

-- ── 1. New product columns ──────────────────────────────────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sizes          text,
  ADD COLUMN IF NOT EXISTS finish_options text,
  ADD COLUMN IF NOT EXISTS delivery_time  text,
  ADD COLUMN IF NOT EXISTS starting_price integer;

-- ── 2. New category column ──────────────────────────────────────────────────
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS seo_text text;

-- ── 3. Product name / slug fixes (5 explicit renames) ──────────────────────
UPDATE products SET name = 'Royal Carved Tufted Sofa', slug = 'royal-carved-tufted-sofa'
  WHERE slug = 'imran-khan-sofa';

UPDATE products SET name = 'Modern Cushion Sofa', slug = 'modern-cushion-sofa'
  WHERE slug = 'modren-cushion-sofa';

UPDATE products SET name = 'Modern Cushion Sofa Set', slug = 'modern-cushion-sofa-set'
  WHERE slug = 'modren-cushion';

UPDATE products SET name = 'Modern Single Bed', slug = 'modern-single-bed'
  WHERE slug = 'modren-single-bed';

UPDATE products SET name = 'Sleek & Elegant Modern Sofa', slug = 'sleek-elegant-modern-sofa'
  WHERE slug = 'sleek-and-elgenant-with-modren-touch';

-- ── 4. Remove "free delivery" from sofas meta description ──────────────────
UPDATE products
  SET meta_description = regexp_replace(meta_description, ',?\s*free delivery[^.]*\.?', '', 'i')
  WHERE meta_description ILIKE '%free delivery%'
    AND category_id = (SELECT id FROM categories WHERE slug = 'sofas');

-- ── 5. Category SEO text seeds (120–180 words each) ────────────────────────
-- Edit these texts before running, or update them later via the admin panel.

UPDATE categories SET seo_text =
'CH Furniture House crafts premium handmade sofas in Sialkot, Pakistan, using solid Sheesham, Teak, and Rosewood. Each sofa is built to order in our workshop — from compact 2-seaters and generous L-shapes to fully custom configurations that fit your exact room dimensions. Our skilled craftsmen hand-carve every frame, apply durable lacquer or oil finishes, and upholster with high-density foam covered in fabric or leather of your choice. Popular styles range from classic Chesterfield tufted designs and ornate carved parlour sofas to clean-lined modern sectionals. All pieces can be customised by size, wood species, finish colour, and upholstery fabric. Delivery across Pakistan with white-glove setup. Message us on WhatsApp to discuss your requirements, request a price quote, or arrange a visit to our Sialkot showroom.'
WHERE slug = 'sofas';

UPDATE categories SET seo_text =
'CH Furniture House manufactures solid-wood beds in Sialkot crafted to the highest standards of Pakistani furniture making. Our beds are built from kiln-dried Sheesham, Walnut, or Teak, with mortise-and-tenon joinery and hand-carved headboards that last for generations. Choose from single, double, king, and custom sizes. Popular designs include opulent carved four-poster beds, sleek panel beds with upholstered headboards, and traditional charpai-inspired platform frames. Every piece is finished with eco-friendly lacquer or natural oil that enhances the wood grain. We also offer matching bedside tables, wardrobes, and full bedroom sets as coordinated packages. Custom sizing is standard — tell us your mattress dimensions and room constraints and we build accordingly. Enquire on WhatsApp for pricing and lead times.'
WHERE slug = 'beds';

UPDATE categories SET seo_text =
'Our bespoke wardrobes are designed and built in-house at CH Furniture House in Sialkot, giving you complete control over size, interior layout, and finish. Whether you need a freestanding Almari, a full wall-to-wall wardrobe, a sliding-door unit for tight spaces, or a walk-in dressing room, our craftsmen can deliver it in solid Sheesham or engineered wood with a solid-wood veneer. Internal fittings include hanging rails, adjustable shelves, shoe racks, soft-close drawers, and mirror panels. Finishes range from hand-painted lacquer in any RAL colour to natural oil-waxed wood grain. All wardrobes are delivered flat-packed or fully assembled within Pakistan. Prices vary by size, material, and fittings — message us on WhatsApp with your dimensions for a custom quotation.'
WHERE slug = 'wardrobes';

UPDATE categories SET seo_text =
'A beautifully crafted dining table brings the family together — and CH Furniture House has been making them in Sialkot for over 15 years. Our dining sets range from intimate 4-seater breakfast tables to grand 12-seater banquet tables, all built from solid Sheesham, Walnut, or Rosewood with hand-carved aprons and turned legs. Every chair is upholstered in durable fabric or leather and matched to the table finish. We offer classic carved traditional sets, sleek contemporary designs with chrome accents, and rustic farmhouse styles with reclaimed wood tops. Custom sizing to fit your dining room is standard. Full sets (table + chairs) as well as individual pieces are available. Lead time is typically 6–8 weeks. Visit our Sialkot workshop or enquire on WhatsApp for a price quote.'
WHERE slug IN ('dining', 'dining-sets', 'dining-tables');

UPDATE categories SET seo_text =
'CH Furniture House crafts statement chairs in Sialkot — from ornate carved throne chairs and wingback armchairs to bedroom accent chairs and office side chairs. All frames are solid Sheesham or Walnut, hand-finished and upholstered with high-density foam in fabric or leather. Our carved chairs make popular jahez (dowry) pieces and drawing-room centrepieces. Bedroom chairs add a touch of luxury beside a dressing table or chaise. We also manufacture matching sets of dining chairs in any quantity to coordinate with your table. Custom upholstery colours, wood finishes, and sizes are available on every model. Chairs can be ordered individually or as part of a coordinated furniture suite. Message us on WhatsApp with your requirements or visit our showroom in Sialkot.'
WHERE slug = 'chairs';

UPDATE categories SET seo_text =
'CH Furniture House produces a wide range of solid-wood tables for every room: coffee tables, centre tables, side tables, console tables, nesting tables, and study desks. All are crafted from kiln-dried Sheesham, Walnut, or Teak in our Sialkot workshop. Our designs span intricate hand-carved traditional styles — popular for drawing rooms and jahez sets — through to clean modern lines suited to contemporary interiors. Glass tops, marble inlays, and wrought-iron bases are available on selected models. Every table can be made to a custom size and finish to match your existing furniture. Delivery and installation is available across Pakistan. Browse our collection and enquire on WhatsApp for pricing and availability.'
WHERE slug = 'tables';

UPDATE categories SET seo_text =
'The dewan — a traditional Pakistani seating platform used for relaxed socialising — is one of our most requested pieces at CH Furniture House. Our dewans are handcrafted from solid Sheesham with hand-carved frames and deeply cushioned seating upholstered in rich fabric or leather. Available as single-seater, 2-seater, and long bench styles, they suit both traditional havelis and modern drawing rooms. Matching bolster cushions and back cushions are included with every set. We can also produce complete dewan sets with matching side tables and a centre table for a coordinated look. All pieces are made to order in Sialkot — custom sizes, wood finishes, and upholstery are standard. Enquire on WhatsApp for current stock, pricing, and lead times.'
WHERE slug IN ('dewan', 'dewan-sets', 'dewans');

UPDATE categories SET seo_text =
'CH Furniture House designs and builds TV units, entertainment cabinets, and media consoles to fit any living room in Sialkot. Our units combine solid Sheesham or Walnut frames with engineered wood shelving for maximum durability and a premium look. Choose from wall-mounted floating designs, floor-standing cabinets with soft-close doors, or full wall entertainment centres with integrated shelving and storage. Each unit is made to measure — tell us your TV size, wall dimensions, and storage requirements and we will design a bespoke piece. Finishes include natural wood oil, matte lacquer, high-gloss lacquer, and hand-painted colours. Matching side tables and display cabinets are available as coordinated sets. Message us on WhatsApp with your measurements for a custom quote.'
WHERE slug IN ('tv-units', 'tv-cabinets', 'entertainment-units');

UPDATE categories SET seo_text =
'Custom bookshelves and display shelving are a CH Furniture House speciality. We build freestanding bookcases, wall-to-wall library units, floating shelves, and display cabinets from solid Sheesham, Walnut, and Teak. Every shelf can be fitted with adjustable shelf pins, glass doors, LED strip lighting, and lockable drawers for valuables. Our carved traditional bookcases are popular for home offices and study rooms, while clean-lined modern shelving suits contemporary apartments. All units are made to order to exactly your height, width, and depth requirements. Delivery and professional installation across Pakistan. Enquire via WhatsApp with your room dimensions and we will recommend the best configuration for your space.'
WHERE slug IN ('bookshelves', 'shelving', 'display-cabinets');

-- ── 6. PENDING — ask user for decisions on the following before renaming: ───
-- 10 additional "modren" typo products (see list in PR description)
-- 3 duplicate bed names: elegant-handcrafted-bed-with-premium-cushion-work ×3
-- blue-modren-dewan-set: slug says "blue", name says "White" — clarify before renaming
