import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabaseClient";

// ── Types ──────────────────────────────────────────────────────────────────
interface ProductImage {
  url: string;
  is_primary: boolean;
  sort_order: number;
  alt: string | null;
}

interface RawProduct {
  id: string;
  slug: string;
  name: string;
  style: string | null;
  wood_type: string | null;
  finish: string | null;
  dimensions: string | null;
  short_desc: string | null;
  description: string | null;
  features: string[];
  images: ProductImage[];
  video_url: string | null;
  video_poster_url: string | null;
  featured: boolean;
  best_seller: boolean;
  is_active: boolean;
  sort_order: number;
  category_id: string;
  meta_title: string | null;
  meta_description: string | null;
  categories: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    thumb_url: string | null;
    banner_url: string | null;
    hero_video_url: string | null;
    video_mode: boolean;
  } | null;
}

// Coerces a raw Supabase row into RawProduct, returning null for rows that are
// missing the required slug/name/category_id fields (e.g. orphaned DB rows).
function normalizeProduct(row: unknown): RawProduct | null {
  const r = row as Record<string, unknown>;
  if (!r || typeof r.slug !== "string" || typeof r.name !== "string" || typeof r.category_id !== "string") {
    return null;
  }
  return {
    id: typeof r.id === "string" ? r.id : "",
    slug: r.slug,
    name: r.name,
    style: (r.style as string | null) ?? null,
    wood_type: (r.wood_type as string | null) ?? null,
    finish: (r.finish as string | null) ?? null,
    dimensions: (r.dimensions as string | null) ?? null,
    short_desc: (r.short_desc as string | null) ?? null,
    description: (r.description as string | null) ?? null,
    features: Array.isArray(r.features) ? (r.features as string[]) : [],
    images: Array.isArray(r.images) ? (r.images as ProductImage[]) : [],
    video_url: (r.video_url as string | null) ?? null,
    video_poster_url: (r.video_poster_url as string | null) ?? null,
    featured: r.featured === true,
    best_seller: r.best_seller === true,
    is_active: r.is_active === true,
    sort_order: typeof r.sort_order === "number" ? r.sort_order : 0,
    category_id: r.category_id,
    meta_title: (r.meta_title as string | null) ?? null,
    meta_description: (r.meta_description as string | null) ?? null,
    categories: r.categories as RawProduct["categories"],
  };
}

// Transform a raw product row into the shape the frontend components expect.
// This ensures zero frontend changes.
function toCard(p: RawProduct) {
  const imgs: ProductImage[] = Array.isArray(p.images) ? p.images : [];
  const primary = imgs.find((i) => i.is_primary) ?? imgs[0] ?? null;
  return {
    slug: p.slug,
    name: p.name,
    style: p.style,
    woodType: p.wood_type,
    shortDesc: p.short_desc,
    categorySlug: p.categories?.slug ?? "",
    imageUrl: primary?.url ?? null,
    videoUrl: p.video_url ?? null,
    videoPosterUrl: p.video_poster_url ?? null,
  };
}

function toDetail(p: RawProduct) {
  const imgs: ProductImage[] = Array.isArray(p.images) ? p.images : [];
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    style: p.style,
    woodType: p.wood_type,
    finish: p.finish,
    dimensions: p.dimensions,
    shortDesc: p.short_desc,
    description: p.description,
    features: p.features ?? [],
    featured: p.featured,
    bestSeller: p.best_seller,
    published: p.is_active,
    sortOrder: p.sort_order,
    categoryId: p.category_id,
    metaTitle: p.meta_title,
    metaDescription: p.meta_description,
    // Reconstruct images array in the shape the frontend components expect
    images: imgs.map((img, idx) => ({
      id: `${p.id}_img_${idx}`,
      url: img.url,
      publicId: null,
      alt: img.alt ?? null,
      width: null,
      height: null,
      isPrimary: img.is_primary,
      sortOrder: img.sort_order,
      furnitureId: p.id,
    })),
    // Reconstruct videos array
    videos: p.video_url
      ? [
          {
            id: `${p.id}_vid_0`,
            url: p.video_url,
            publicId: null,
            posterUrl: p.video_poster_url ?? null,
            title: null,
            sortOrder: 0,
            furnitureId: p.id,
          },
        ]
      : [],
    category: p.categories
      ? {
          id: p.categories.id,
          slug: p.categories.slug,
          name: p.categories.name,
          description: p.categories.description,
          thumbUrl: p.categories.thumb_url,
          bannerUrl: p.categories.banner_url,
          heroVideoUrl: p.categories.hero_video_url,
          videoMode: p.categories.video_mode,
        }
      : null,
  };
}

// ── Public queries (cached) ────────────────────────────────────────────────

export const getFeaturedCategories = unstable_cache(
  async (limit = 6) => {
    const { data: cats } = await supabase
      .from("categories")
      .select("id, slug, name, description, thumb_url")
      .eq("featured", true)
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (!cats || cats.length === 0) return [];

    const catIds = cats.map((c) => c.id);
    const { data: products } = await supabase
      .from("products")
      .select("category_id")
      .in("category_id", catIds)
      .eq("is_active", true);

    const countMap: Record<string, number> = {};
    for (const p of products ?? []) {
      countMap[p.category_id] = (countMap[p.category_id] ?? 0) + 1;
    }

    return cats.map((cat) => ({
      slug: cat.slug, name: cat.name,
      description: cat.description, thumbUrl: cat.thumb_url,
      count: countMap[cat.id] ?? 0,
    }));
  },
  ["featured-categories"],
  { revalidate: 60, tags: ["categories"] }
);

export const getAllCategories = unstable_cache(
  async () => {
    const { data: cats } = await supabase
      .from("categories")
      .select("id, slug, name, description, thumb_url")
      .order("sort_order", { ascending: true });

    if (!cats || cats.length === 0) return [];

    const { data: products } = await supabase
      .from("products")
      .select("category_id")
      .eq("is_active", true);

    const countMap: Record<string, number> = {};
    for (const p of products ?? []) {
      countMap[p.category_id] = (countMap[p.category_id] ?? 0) + 1;
    }

    return cats.map((cat) => ({
      slug: cat.slug, name: cat.name,
      description: cat.description, thumbUrl: cat.thumb_url,
      count: countMap[cat.id] ?? 0,
    }));
  },
  ["all-categories"],
  { revalidate: 60, tags: ["categories"] }
);

export const getFeaturedFurniture = unstable_cache(
  async (limit = 10) => {
    // Try featured / best-seller products first
    const { data: flagged } = await supabase
      .from("products")
      .select("*, categories(id, slug, name, description, thumb_url, banner_url, hero_video_url, video_mode)")
      .eq("is_active", true)
      .or("featured.eq.true,best_seller.eq.true")
      .order("best_seller", { ascending: false })
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (flagged && flagged.length >= limit) {
      return (flagged as unknown[]).map(normalizeProduct).filter(Boolean).map((p) => toCard(p!));
    }

    // Not enough flagged → fill with any active products
    const existing = new Set((flagged ?? []).map((p: any) => p.id));
    const needed = limit - (flagged?.length ?? 0);
    const { data: rest } = await supabase
      .from("products")
      .select("*, categories(id, slug, name, description, thumb_url, banner_url, hero_video_url, video_mode)")
      .eq("is_active", true)
      .not("id", "in", `(${[...existing, "00000000-0000-0000-0000-000000000000"].join(",")})`)
      .order("sort_order", { ascending: true })
      .limit(needed);

    return [...(flagged ?? []), ...(rest ?? [])]
      .map(normalizeProduct).filter(Boolean).map((p) => toCard(p!));
  },
  ["featured-furniture"],
  { revalidate: 60, tags: ["furniture"] }
);

export const getTestimonials = unstable_cache(
  async (limit = 6) => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .limit(limit);
    return data ?? [];
  },
  ["testimonials"],
  { revalidate: 300, tags: ["testimonials"] }
);

export async function getCategoryWithFurniture(
  slug: string,
  filters?: { style?: string; woodType?: string }
) {
  const cacheKey = `category-${slug}-${filters?.style ?? ""}-${filters?.woodType ?? ""}`;
  return unstable_cache(
    async () => {
      const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!category) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cat = category as Record<string, any>;

      let query = supabase
        .from("products")
        .select("*, categories(id, slug, name, description, thumb_url, banner_url, hero_video_url, video_mode)")
        .eq("category_id", cat.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (filters?.style) query = query.eq("style", filters.style);
      if (filters?.woodType) query = query.eq("wood_type", filters.woodType);

      const { data: furniture } = await query;

      return {
        category: {
          id: cat.id, slug: cat.slug, name: cat.name,
          description: cat.description, thumbUrl: cat.thumb_url,
          bannerUrl: cat.banner_url, heroVideoUrl: cat.hero_video_url,
          heroVideoPosterUrl: cat.hero_video_poster_url,
          videoMode: cat.video_mode, featured: cat.featured,
          sortOrder: cat.sort_order,
        },
        furniture: (furniture ?? []).map(normalizeProduct).filter(Boolean).map((p) => toCard(p!)),
      };
    },
    [cacheKey],
    { revalidate: 60, tags: ["categories", "furniture"] }
  )();
}

export async function getFurnitureBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from("products")
        .select("*, categories(id, slug, name, description, thumb_url, banner_url, hero_video_url, video_mode)")
        .eq("slug", slug)
        .single();

      if (!data) return null;
      const normalized = normalizeProduct(data);
      return normalized ? toDetail(normalized) : null;
    },
    [`furniture-${slug}`],
    { revalidate: 60, tags: ["furniture"] }
  )();
}

export async function getRelated(categoryId: string, excludeId: string, limit = 4) {
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from("products")
        .select("*, categories(id, slug, name, description, thumb_url, banner_url, hero_video_url, video_mode)")
        .eq("category_id", categoryId)
        .eq("is_active", true)
        .neq("id", excludeId)
        .limit(limit);

      return (data ?? []).map(normalizeProduct).filter(Boolean).map((p) => toCard(p!));
    },
    [`related-${categoryId}-${excludeId}`],
    { revalidate: 60, tags: ["furniture"] }
  )();
}

export async function searchFurniture(q: string) {
  if (!q.trim()) return [];

  const { data } = await supabase
    .from("products")
    .select("*, categories(id, slug, name, description, thumb_url, banner_url, hero_video_url, video_mode)")
    .eq("is_active", true)
    .or(
      `name.ilike.%${q}%,style.ilike.%${q}%,wood_type.ilike.%${q}%,short_desc.ilike.%${q}%`
    )
    .limit(40);

  return (data ?? []).map(normalizeProduct).filter(Boolean).map((p) => toCard(p!));
}

export async function getAllSlugs() {
  const [{ data: cats }, { data: items }] = await Promise.all([
    supabase.from("categories").select("slug, updated_at"),
    supabase.from("products").select("slug, updated_at, categories(slug)").eq("is_active", true),
  ]);

  return {
    cats: (cats ?? []).map((c) => ({ slug: c.slug, updatedAt: c.updated_at })),
    items: (items ?? []).map((p: any) => ({
      slug: p.slug,
      updatedAt: p.updated_at,
      category: { slug: p.categories?.slug ?? "" },
    })),
  };
}
