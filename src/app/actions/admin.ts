"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { authOptions } from "@/lib/auth";
import { deleteAsset } from "@/lib/cloudinary";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
}

/* ------------------------------- Categories ------------------------------- */

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  seoText: z.string().optional(),
  bannerUrl: z.string().optional(),
  thumbUrl: z.string().optional(),
  heroVideoUrl: z.string().optional(),
  heroVideoPosterUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  featured: z.coerce.boolean().default(false),
  videoMode: z.coerce.boolean().default(false),
});

export async function upsertCategory(id: string | null, formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const data = categorySchema.parse({
    ...raw,
    featured: formData.get("featured") === "on",
    videoMode: formData.get("videoMode") === "on",
  });
  const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.name);

  if (id) {
    await supabase.from("categories").update({
      slug, name: data.name, description: data.description || null,
      seo_text: data.seoText || null,
      banner_url: data.bannerUrl || null, thumb_url: data.thumbUrl || null,
      hero_video_url: data.heroVideoUrl || null,
      hero_video_poster_url: data.heroVideoPosterUrl || null,
      sort_order: data.sortOrder, featured: data.featured,
      video_mode: data.videoMode,
    }).eq("id", id);
  } else {
    await supabase.from("categories").insert({
      slug, name: data.name, description: data.description || null,
      seo_text: data.seoText || null,
      banner_url: data.bannerUrl || null, thumb_url: data.thumbUrl || null,
      hero_video_url: data.heroVideoUrl || null,
      hero_video_poster_url: data.heroVideoPosterUrl || null,
      sort_order: data.sortOrder, featured: data.featured,
      video_mode: data.videoMode,
    });
  }

  revalidateTag("categories");
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
  revalidatePath(`/category/${slug}`);
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  // Get category products to clean up their Cloudinary media
  const { data: products } = await supabase
    .from("products")
    .select("id, images, video_url")
    .eq("category_id", id);

  if (products) {
    const publicIds = products.flatMap((p) =>
      (Array.isArray(p.images) ? p.images : [])
        .map((img: { publicId?: string }) => img.publicId)
        .filter(Boolean) as string[]
    );
    await Promise.all(publicIds.map((pid) => deleteAsset(pid, "image")));
  }

  await supabase.from("categories").delete().eq("id", id);

  revalidateTag("categories");
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

/* -------------------------------- Furniture ------------------------------- */

const furnitureSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  categoryId: z.string().min(1),
  style: z.string().optional(),
  woodType: z.string().optional(),
  finish: z.string().optional(),
  dimensions: z.string().optional(),
  sizes: z.string().optional(),
  finishOptions: z.string().optional(),
  deliveryTime: z.string().optional(),
  startingPrice: z.coerce.number().int().positive().optional(),
  shortDesc: z.string().optional(),
  description: z.string().optional(),
  features: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export async function upsertFurniture(
  id: string | null,
  formData: FormData,
  media: {
    images: { url: string; publicId: string }[];
    videos: { url: string; publicId: string; posterUrl?: string }[];
  }
) {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = furnitureSchema.parse(raw);

  const featuresArr = (parsed.features || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const { data: category } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", parsed.categoryId)
    .single();

  const base = {
    name: parsed.name,
    slug: parsed.slug?.trim() ? slugify(parsed.slug) : slugify(parsed.name),
    category_id: parsed.categoryId,
    style: parsed.style || null,
    wood_type: parsed.woodType || null,
    finish: parsed.finish || null,
    dimensions: parsed.dimensions || null,
    sizes: parsed.sizes || null,
    finish_options: parsed.finishOptions || null,
    delivery_time: parsed.deliveryTime || null,
    starting_price: parsed.startingPrice ?? null,
    short_desc: parsed.shortDesc || null,
    description: parsed.description || null,
    features: featuresArr,
    sort_order: parsed.sortOrder,
    featured: formData.get("featured") === "on",
    best_seller: formData.get("bestSeller") === "on",
    is_active: formData.get("published") !== "off",
  };

  let furnitureId = id;

  if (id) {
    // Fetch existing images to append to
    const { data: existing } = await supabase
      .from("products")
      .select("images, video_url, video_poster_url")
      .eq("id", id)
      .single();

    const existingImages: any[] = Array.isArray(existing?.images) ? existing.images : [];
    const newImages = media.images.map((m, i) => ({
      url: m.url,
      publicId: m.publicId,
      is_primary: existingImages.length === 0 && i === 0,
      sort_order: existingImages.length + i,
      alt: null,
    }));

    await supabase.from("products").update({
      ...base,
      images: [...existingImages, ...newImages],
      video_url: media.videos[0]?.url || existing?.video_url || null,
      video_poster_url: media.videos[0]?.posterUrl || existing?.video_poster_url || null,
    }).eq("id", id);
  } else {
    const images = media.images.map((m, i) => ({
      url: m.url, publicId: m.publicId,
      is_primary: i === 0, sort_order: i, alt: null,
    }));
    const { data: created } = await supabase
      .from("products")
      .insert({
        ...base,
        images,
        video_url: media.videos[0]?.url || null,
        video_poster_url: media.videos[0]?.posterUrl || null,
      })
      .select("id")
      .single();
    furnitureId = created?.id ?? null;
  }

  if (category?.slug) revalidatePath(`/category/${category.slug}`);
  revalidateTag("furniture");
  revalidatePath("/admin/furniture");
  revalidatePath("/");
  return furnitureId;
}

export async function deleteFurniture(id: string) {
  await requireAdmin();

  const { data: p } = await supabase
    .from("products")
    .select("images, video_url")
    .eq("id", id)
    .single();

  if (p) {
    const imgs: any[] = Array.isArray(p.images) ? p.images : [];
    await Promise.all(
      imgs.filter((img) => img.publicId).map((img) => deleteAsset(img.publicId, "image"))
    );
  }

  await supabase.from("products").delete().eq("id", id);
  revalidateTag("furniture");
  revalidatePath("/admin/furniture");
}

export async function deleteImage(productId: string, imageIndex: number) {
  await requireAdmin();

  const { data: p } = await supabase
    .from("products")
    .select("images")
    .eq("id", productId)
    .single();

  if (!p) return;
  const imgs: any[] = Array.isArray(p.images) ? p.images : [];
  const target = imgs[imageIndex];

  if (target?.publicId) await deleteAsset(target.publicId, "image");

  const updated = imgs.filter((_, i) => i !== imageIndex);
  // If we removed the primary, make the first one primary
  if (target?.is_primary && updated.length > 0) updated[0].is_primary = true;

  await supabase.from("products").update({ images: updated }).eq("id", productId);
  revalidatePath("/admin/furniture");
}

export async function setPrimaryImage(productId: string, imageIndex: number) {
  await requireAdmin();

  const { data: p } = await supabase
    .from("products")
    .select("images")
    .eq("id", productId)
    .single();

  if (!p) return;
  const imgs: any[] = Array.isArray(p.images) ? p.images : [];
  const updated = imgs.map((img, i) => ({ ...img, is_primary: i === imageIndex }));
  await supabase.from("products").update({ images: updated }).eq("id", productId);
  revalidatePath("/admin/furniture");
}

export async function deleteVideo(productId: string) {
  await requireAdmin();

  const { data: p } = await supabase
    .from("products")
    .select("video_url")
    .eq("id", productId)
    .single();

  await supabase
    .from("products")
    .update({ video_url: null, video_poster_url: null })
    .eq("id", productId);

  revalidatePath("/admin/furniture");
}

/* -------------------------------- Settings -------------------------------- */

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const get = (k: string) => (formData.get(k) as string | null) ?? undefined;
  const num = (k: string) => {
    const v = formData.get(k);
    return v ? parseInt(String(v), 10) : undefined;
  };

  // Save core settings (columns that always exist)
  const { error: coreError } = await supabase.from("settings").upsert({
    id: "singleton",
    brand_name: get("brandName"), tagline: get("tagline"), description: get("description"),
    address: get("address"), phone: get("phone"), whatsapp: get("whatsapp"),
    email: get("email"), business_hours: get("businessHours"), map_embed_url: get("mapEmbedUrl"),
    whatsapp_message: get("whatsappMessage"),
    facebook: get("facebook"), instagram: get("instagram"), youtube: get("youtube"),
    tiktok: get("tiktok"), linkedin: get("linkedin"),
    seo_title: get("seoTitle"), seo_description: get("seoDescription"),
    seo_keywords: get("seoKeywords"), og_image_url: get("ogImageUrl"),
    founder_image_url: get("founderImageUrl"), process_image_url: get("processImageUrl"),
    about_story: get("aboutStory"), about_mission: get("aboutMission"),
    about_vision: get("aboutVision"), about_experience: get("aboutExperience"),
    years_experience: num("yearsExperience"), projects_completed: num("projectsCompleted"),
    happy_clients: num("happyClients"), craftsmen_count: num("craftsmenCount"),
  }, { onConflict: "id" });

  if (coreError) throw new Error(`Settings save failed: ${coreError.message}`);

  // Save workshop video fields in a separate update so a missing-column error is
  // surfaced immediately rather than silently dropped by PostgREST.
  const { error: videoError } = await supabase.from("settings").update({
    workshop_video_desktop_url:        get("workshopVideoDesktopUrl")       || null,
    workshop_video_desktop_poster_url: get("workshopVideoDesktopPosterUrl") || null,
    workshop_video_mobile_url:         get("workshopVideoMobileUrl")        || null,
    workshop_video_mobile_poster_url:  get("workshopVideoMobilePosterUrl")  || null,
  }).eq("id", "singleton");

  if (videoError) throw new Error(`Workshop video save failed: ${videoError.message}`);

  revalidateTag("settings");
  revalidatePath("/", "layout");
}

/* ------------------------------ Testimonials ------------------------------ */

export async function upsertTestimonial(id: string | null, formData: FormData) {
  await requireAdmin();
  const data = {
    author: String(formData.get("author")),
    role: (formData.get("role") as string) || null,
    quote: String(formData.get("quote")),
    rating: parseInt(String(formData.get("rating") || "5"), 10),
    published: formData.get("published") !== "off",
    sort_order: parseInt(String(formData.get("sortOrder") || "0"), 10),
  };

  if (id) {
    await supabase.from("testimonials").update(data).eq("id", id);
  } else {
    await supabase.from("testimonials").insert(data);
  }

  revalidateTag("testimonials");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidateTag("testimonials");
  revalidatePath("/admin/testimonials");
}

/* -------------------------------- Messages -------------------------------- */

export async function markMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await supabase.from("contact_messages").update({ read }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
}

/* ---------------------------- Bulk create --------------------------------- */

export async function bulkCreateDesigns(
  categoryId: string,
  items: { url: string; publicId: string; name: string }[]
): Promise<void> {
  await requireAdmin();

  // Fetch existing slugs to avoid collisions when deduplicating
  const { data: existing } = await supabase.from("products").select("slug");
  const usedSlugs = new Set((existing ?? []).map((r: any) => r.slug as string));

  function uniqueSlug(base: string): string {
    if (!usedSlugs.has(base)) { usedSlugs.add(base); return base; }
    let n = 2;
    while (usedSlugs.has(`${base}-${n}`)) n++;
    const s = `${base}-${n}`;
    usedSlugs.add(s);
    return s;
  }

  const rows = items.map(({ url, publicId, name }, i) => ({
    name,
    slug: uniqueSlug(slugify(name)),
    category_id: categoryId,
    is_active: true,
    sort_order: i,
    images: [{ url, publicId, is_primary: true, sort_order: 0, alt: name }],
  }));

  await supabase.from("products").insert(rows);

  revalidateTag("furniture");
  revalidatePath(`/admin/categories/${categoryId}`);
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
