"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { supabase } from "@/lib/supabaseClient";
import { slugify } from "@/lib/utils";

function uploadToCloudinary(buffer: Buffer): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ch-furniture", resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

function detectCategory(filename: string) {
  const n = filename.toLowerCase();
  if (n.includes("sofa")) return "Sofa";
  if (n.includes("bed")) return "Bed";
  if (n.includes("chair")) return "Chair";
  if (n.includes("table")) return "Table";
  if (n.includes("almari") || n.includes("wardrobe")) return "Almari";
  return "Other";
}

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function uniqueSlug(title: string) {
  return `${slugify(title)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_FILES_PER_BATCH = 50;

export async function bulkUploadAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const files = formData
    .getAll("files")
    .filter((v): v is File => v instanceof File)
    .slice(0, MAX_FILES_PER_BATCH);
  let count = 0;

  for (const file of files) {
    try {
      if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size === 0 || file.size > MAX_FILE_SIZE_BYTES) continue;

      const uploaded = await uploadToCloudinary(Buffer.from(await file.arrayBuffer()));
      const categoryName = detectCategory(file.name);
      const categorySlug = slugify(categoryName);

      // Upsert category
      let categoryId: string;
      const { data: existingCat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (existingCat) {
        categoryId = existingCat.id;
      } else {
        const { data: newCat } = await supabase
          .from("categories")
          .insert({ name: categoryName, slug: categorySlug })
          .select("id")
          .single();
        categoryId = newCat!.id;
      }

      const title = titleFromFilename(file.name);
      await supabase.from("products").insert({
        name: title || "Untitled Furniture",
        slug: uniqueSlug(title || "untitled-furniture"),
        category_id: categoryId,
        description: `Premium quality ${categoryName} from CH Furniture. Made with high-quality wood and crafted for lasting beauty.`,
        is_active: true,
        images: [{ url: uploaded.url, publicId: uploaded.publicId, is_primary: true, sort_order: 0, alt: title }],
      });
      count++;
    } catch (err) {
      console.error(`Bulk upload failed for ${file.name}:`, err);
    }
  }

  revalidatePath("/admin/furniture");
  revalidatePath("/collections");
  revalidatePath("/categories");
  return { success: true, count };
}
