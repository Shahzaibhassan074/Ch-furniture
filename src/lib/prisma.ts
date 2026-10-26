/**
 * Supabase-backed compatibility shim.
 *
 * Exports the same `prisma` API surface as before so every admin page, public
 * page, and utility that imports from "@/lib/prisma" continues to work with
 * zero changes — all queries are now routed to Supabase.
 *
 * Also keeps `withRetry` (used by about/page.tsx and home/page.tsx).
 */

import { supabase } from "@/lib/supabaseClient";

// ── Data transformers ─────────────────────────────────────────────────────
// Convert Supabase snake_case → Prisma camelCase so the frontend shape is unchanged.

function transformProduct(p: any) {
  if (!p) return null;
  const imgs: any[] = Array.isArray(p.images) ? p.images : [];
  const images = imgs.map((img: any, i: number) => ({
    id: `${p.id}_img_${i}`,
    url: img.url,
    publicId: img.publicId ?? img.public_id ?? null,
    alt: img.alt ?? null,
    width: null,
    height: null,
    isPrimary: img.is_primary ?? false,
    sortOrder: img.sort_order ?? i,
    furnitureId: p.id,
    createdAt: p.created_at,
  }));
  const videos = p.video_url
    ? [{ id: `${p.id}_vid_0`, url: p.video_url, publicId: null,
         posterUrl: p.video_poster_url ?? null, title: null,
         sortOrder: 0, furnitureId: p.id, createdAt: p.created_at }]
    : [];

  return {
    id: p.id, slug: p.slug, name: p.name,
    style: p.style ?? null,
    woodType: p.wood_type ?? null,
    finish: p.finish ?? null,
    dimensions: p.dimensions ?? null,
    shortDesc: p.short_desc ?? null,
    description: p.description ?? null,
    features: JSON.stringify(Array.isArray(p.features) ? p.features : []),
    featured: p.featured ?? false,
    bestSeller: p.best_seller ?? false,
    published: p.is_active !== false,
    sortOrder: p.sort_order ?? 0,
    categoryId: p.category_id,
    metaTitle: p.meta_title ?? null,
    metaDescription: p.meta_description ?? null,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    images,
    videos,
    category: p.categories ? transformCategory(p.categories) : null,
  };
}

function transformCategory(c: any) {
  if (!c) return null;
  return {
    id: c.id, slug: c.slug, name: c.name,
    description: c.description ?? null,
    bannerUrl: c.banner_url ?? null,
    thumbUrl: c.thumb_url ?? null,
    heroVideoUrl: c.hero_video_url ?? null,
    heroVideoPosterUrl: c.hero_video_poster_url ?? null,
    sortOrder: c.sort_order ?? 0,
    featured: c.featured ?? false,
    videoMode: c.video_mode ?? false,
    metaTitle: c.meta_title ?? null,
    metaDescription: c.meta_description ?? null,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    furniture: Array.isArray(c.products) ? c.products.map(transformProduct) : [],
  };
}

function transformTestimonial(t: any) {
  if (!t) return null;
  return {
    id: t.id, author: t.author, role: t.role ?? null,
    quote: t.quote, rating: t.rating ?? 5,
    avatarUrl: t.avatar_url ?? null,
    published: t.published !== false,
    sortOrder: t.sort_order ?? 0,
    createdAt: t.created_at, updatedAt: t.updated_at,
  };
}

function transformMessage(m: any) {
  if (!m) return null;
  return {
    id: m.id, name: m.name, email: m.email ?? null,
    phone: m.phone ?? null, message: m.message,
    read: m.read ?? false, createdAt: m.created_at,
  };
}

export function transformSettings(s: any) {
  if (!s) return null;
  return {
    id: s.id,
    brandName: s.brand_name ?? "CH FURNITURE",
    tagline: s.tagline ?? null,
    description: s.description ?? null,
    address: s.address ?? null,
    phone: s.phone ?? null,
    whatsapp: s.whatsapp ?? null,
    email: s.email ?? null,
    businessHours: s.business_hours ?? null,
    mapEmbedUrl: s.map_embed_url ?? null,
    whatsappMessage: s.whatsapp_message ?? null,
    facebook: s.facebook ?? null,
    instagram: s.instagram ?? null,
    youtube: s.youtube ?? null,
    tiktok: s.tiktok ?? null,
    linkedin: s.linkedin ?? null,
    seoTitle: s.seo_title ?? null,
    seoDescription: s.seo_description ?? null,
    seoKeywords: s.seo_keywords ?? null,
    ogImageUrl: s.og_image_url ?? null,
    founderImageUrl: s.founder_image_url ?? null,
    processImageUrl: s.process_image_url ?? null,
    aboutStory: s.about_story ?? null,
    aboutMission: s.about_mission ?? null,
    aboutVision: s.about_vision ?? null,
    aboutExperience: s.about_experience ?? null,
    yearsExperience: s.years_experience ?? 15,
    projectsCompleted: s.projects_completed ?? 1200,
    happyClients: s.happy_clients ?? 800,
    craftsmenCount: s.craftsmen_count ?? 40,
    workshopVideoDesktopUrl: s.workshop_video_desktop_url ?? null,
    workshopVideoDesktopPosterUrl: s.workshop_video_desktop_poster_url ?? null,
    workshopVideoMobileUrl: s.workshop_video_mobile_url ?? null,
    workshopVideoMobilePosterUrl: s.workshop_video_mobile_poster_url ?? null,
    updatedAt: s.updated_at,
  };
}

// ── Compatibility shim ────────────────────────────────────────────────────
export const prisma = {
  // ── Furniture (→ products table) ──────────────────────────────────────
  furniture: {
    async findMany(_args?: any) {
      const { data } = await supabase
        .from("products")
        .select("*, categories(id, slug, name, description, thumb_url, banner_url, hero_video_url, video_mode, sort_order, featured)")
        .order("sort_order", { ascending: true });
      return (data ?? []).map(transformProduct).filter(Boolean) as NonNullable<ReturnType<typeof transformProduct>>[];
    },
    async findUnique(_args: any) {
      const where = _args?.where ?? _args ?? {};
      let q = supabase
        .from("products")
        .select("*, categories(id, slug, name, description, thumb_url, banner_url, hero_video_url, video_mode, sort_order, featured)");
      if (where.id) q = q.eq("id", where.id);
      else if (where.slug) q = q.eq("slug", where.slug);
      const { data } = await q.single();
      return transformProduct(data);
    },
    async count(_args?: any) {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      return count ?? 0;
    },
    async create({ data }: any) {
      const featuresArr = typeof data.features === "string"
        ? data.features.split("\n").filter(Boolean) : (data.features ?? []);
      const imgs = (data.images?.create ? [data.images.create].flat() : []).map((img: any, i: number) => ({
        url: img.url, publicId: img.publicId ?? null,
        is_primary: img.isPrimary ?? i === 0,
        sort_order: img.sortOrder ?? i, alt: img.alt ?? null,
      }));
      const { data: created } = await supabase.from("products").insert({
        name: data.name, slug: data.slug, category_id: data.categoryId,
        description: data.description ?? null, meta_title: data.metaTitle ?? null,
        meta_description: data.metaDescription ?? null,
        is_active: data.published !== false,
        sort_order: data.sortOrder ?? 0, features: featuresArr, images: imgs,
      }).select().single();
      return transformProduct(created);
    },
    async update({ where, data }: any) {
      const update: any = {};
      if (data.name !== undefined) update.name = data.name;
      if (data.published !== undefined) update.is_active = data.published;
      if (data.sortOrder !== undefined) update.sort_order = data.sortOrder;
      await supabase.from("products").update(update).eq("id", where.id);
    },
    async delete({ where }: any) {
      await supabase.from("products").delete().eq("id", where.id);
    },
  },

  // ── Category (→ categories table) ────────────────────────────────────
  category: {
    async findMany(_args?: any) {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      const cats = (data ?? []).map(transformCategory).filter(Boolean) as NonNullable<ReturnType<typeof transformCategory>>[];

      // Support Prisma-style _count: { select: { furniture: true } }
      const needsCount = _args?.select?._count;
      if (needsCount && cats.length > 0) {
        const { data: products } = await supabase
          .from("products")
          .select("category_id")
          .eq("is_active", true);
        const countMap: Record<string, number> = {};
        for (const p of products ?? []) {
          countMap[p.category_id] = (countMap[p.category_id] ?? 0) + 1;
        }
        return cats.map((c) => ({ ...c, _count: { furniture: countMap[c.id] ?? 0 } }));
      }

      return cats;
    },
    async findUnique(_args: any) {
      const where = _args?.where ?? _args ?? {};
      let q = supabase.from("categories").select("*");
      if (where.id) q = q.eq("id", where.id);
      else if (where.slug) q = q.eq("slug", where.slug);
      const { data } = await q.single();
      const cat = transformCategory(data);
      if (!cat) return null;

      // Support Prisma-style select: { furniture: { ... } }
      const needsFurniture = _args?.select?.furniture;
      if (needsFurniture) {
        const { data: products } = await supabase
          .from("products")
          .select("*, categories(id, slug, name, description, thumb_url, banner_url, hero_video_url, video_mode, sort_order, featured)")
          .eq("category_id", cat.id)
          .order("sort_order", { ascending: true });
        cat.furniture = (products ?? []).map(transformProduct).filter(Boolean) as any[];
      }

      return cat;
    },
    async count() {
      const { count } = await supabase
        .from("categories").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
    async upsert({ where, create, update: upd }: any) {
      const slug = where.slug ?? create.slug;
      const { data: existing } = await supabase
        .from("categories").select("id").eq("slug", slug).single();
      if (existing) {
        const { data } = await supabase
          .from("categories").update({ name: upd.name, slug: upd.slug ?? slug })
          .eq("slug", slug).select().single();
        return transformCategory(data);
      }
      const { data } = await supabase
        .from("categories").insert({ name: create.name, slug: create.slug })
        .select().single();
      return transformCategory(data);
    },
    async create({ data }: any) {
      const { data: created } = await supabase
        .from("categories").insert({ name: data.name, slug: data.slug })
        .select().single();
      return transformCategory(created);
    },
  },

  // ── Testimonial ───────────────────────────────────────────────────────
  testimonial: {
    async findMany(_args?: any) {
      const { data } = await supabase
        .from("testimonials").select("*").order("sort_order", { ascending: true });
      return (data ?? []).map(transformTestimonial).filter(Boolean) as NonNullable<ReturnType<typeof transformTestimonial>>[];
    },
    async count() {
      const { count } = await supabase
        .from("testimonials").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
    async create({ data }: any) {
      const { data: created } = await supabase.from("testimonials").insert({
        author: data.author, role: data.role ?? null, quote: data.quote,
        rating: data.rating ?? 5, published: data.published !== false,
        sort_order: data.sortOrder ?? 0,
      }).select().single();
      return transformTestimonial(created);
    },
    async update({ where, data }: any) {
      await supabase.from("testimonials").update({
        author: data.author, role: data.role, quote: data.quote,
        rating: data.rating, published: data.published,
        sort_order: data.sortOrder,
      }).eq("id", where.id);
    },
    async delete({ where }: any) {
      await supabase.from("testimonials").delete().eq("id", where.id);
    },
  },

  // ── ContactMessage ───────────────────────────────────────────────────
  contactMessage: {
    async findMany(_args?: any) {
      const { data } = await supabase
        .from("contact_messages").select("*")
        .order("created_at", { ascending: false }).limit(100);
      return (data ?? []).map(transformMessage).filter(Boolean) as NonNullable<ReturnType<typeof transformMessage>>[];
    },
    async count(_args?: any) {
      const where = _args?.where;
      let q = supabase.from("contact_messages").select("*", { count: "exact", head: true });
      if (where?.read !== undefined) q = q.eq("read", where.read);
      const { count } = await q;
      return count ?? 0;
    },
    async update({ where, data }: any) {
      await supabase.from("contact_messages").update({ read: data.read }).eq("id", where.id);
    },
    async delete({ where }: any) {
      await supabase.from("contact_messages").delete().eq("id", where.id);
    },
    async create({ data }: any) {
      const { data: created } = await supabase.from("contact_messages").insert({
        name: data.name, email: data.email ?? null,
        phone: data.phone ?? null, message: data.message,
      }).select().single();
      return transformMessage(created);
    },
  },

  // ── Settings ─────────────────────────────────────────────────────────
  settings: {
    async findUnique(_args?: any) {
      const { data } = await supabase.from("settings").select("*").eq("id", "singleton").single();
      return transformSettings(data);
    },
    async create({ data }: any) {
      const { data: created } = await supabase
        .from("settings").insert({ id: "singleton" }).select().single();
      return transformSettings(created);
    },
    async upsert(_args?: any) {
      const { data } = await supabase
        .from("settings").upsert({ id: "singleton" }, { onConflict: "id" }).select().single();
      return transformSettings(data);
    },
    async update({ where, data: upd }: any) {
      await supabase.from("settings").update(upd).eq("id", where.id ?? "singleton");
    },
  },

  // ── Image / Video ── stubs (data now in products.images JSONB) ────────
  image: {
    async findUnique(_args?: any) { return null; },
    async count(_args?: any) { return 0; },
    async create(_args?: any) { return null; },
    async createMany(_args?: any) { return { count: 0 }; },
    async update(_args?: any) { return null; },
    async updateMany(_args?: any) { return { count: 0 }; },
    async delete(_args?: any) { return null; },
  },
  video: {
    async findUnique(_args?: any) { return null; },
    async create(_args?: any) { return null; },
    async createMany(_args?: any) { return { count: 0 }; },
    async delete(_args?: any) { return null; },
  },

  // ── Bulk importer — not migrated, return empty stubs ──────────────────
  bulk50Draft: {
    async findMany(_args?: any) { return [] as any[]; },
    async findUnique(_args?: any) { return null; },
    async count(_args?: any) { return 0; },
    async groupBy(_args?: any) { return [] as any[]; },
    async create(_args?: any) { return null; },
    async createMany(_args?: any) { return { count: 0 }; },
    async update(_args?: any) { return null; },
    async updateMany(_args?: any) { return { count: 0 }; },
    async delete(_args?: any) { return null; },
    async deleteMany(_args?: any) { return { count: 0 }; },
  },
  bulkImportHistory: {
    async upsert(_args?: any) { return null; },
    async findMany(_args?: any) { return [] as any[]; },
    async count(_args?: any) { return 0; },
  },
};

// ── withRetry (kept for backward compat — about/page.tsx, home/page.tsx) ──
export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseDelayMs = 1500,
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isTransient =
        msg.includes("Can't reach database") ||
        msg.includes("Connection refused") ||
        msg.includes("ECONNREFUSED") ||
        msg.includes("connection timeout") ||
        msg.includes("fetch failed") ||
        msg.includes("socket hang up") ||
        msg.includes("ETIMEDOUT");
      if (!isTransient || i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, baseDelayMs * (i + 1)));
    }
  }
  throw new Error("withRetry exhausted");
}
