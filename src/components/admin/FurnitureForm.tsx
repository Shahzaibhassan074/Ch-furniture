"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Star, Trash2, Film } from "lucide-react";
import { MediaUploader, type UploadedMedia } from "@/components/admin/MediaUploader";
import {
  upsertFurniture,
  deleteImage,
  setPrimaryImage,
  deleteVideo,
} from "@/app/actions/admin";
import { parseList } from "@/lib/utils";

type ImageRec = { id: string; url: string; isPrimary: boolean };
type VideoRec = { id: string; url: string; posterUrl: string | null };
type Furniture = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  style: string | null;
  woodType: string | null;
  finish: string | null;
  dimensions: string | null;
  sizes: string | null;
  finishOptions: string | null;
  deliveryTime: string | null;
  startingPrice: number | null;
  shortDesc: string | null;
  description: string | null;
  features: string | null;
  sortOrder: number;
  featured: boolean;
  bestSeller: boolean;
  published: boolean;
  images: ImageRec[];
  videos: VideoRec[];
};

const field =
  "w-full rounded-lg border border-inkBorder bg-white px-4 py-2.5 text-ink placeholder:text-inkMuted/60 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra/20 transition-colors";
const label = "block text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted mb-1.5";

export function FurnitureForm({
  furniture,
  categories,
  styles,
  woods,
  defaultCategoryId,
  backUrl,
}: {
  furniture: Furniture | null;
  categories: { id: string; name: string }[];
  styles: readonly string[];
  woods: readonly string[];
  defaultCategoryId?: string;
  backUrl?: string;
}) {
  const router = useRouter();
  const [newImages, setNewImages] = useState<UploadedMedia[]>([]);
  const [newVideos, setNewVideos] = useState<UploadedMedia[]>([]);
  const [saving, setSaving] = useState(false);

  const destination = backUrl ?? "/admin/furniture";
  const categoryName = defaultCategoryId
    ? categories.find((c) => c.id === defaultCategoryId)?.name
    : null;

  async function action(formData: FormData) {
    setSaving(true);
    try {
      await upsertFurniture(furniture?.id ?? null, formData, {
        images: newImages.map((m) => ({ url: m.url, publicId: m.publicId })),
        videos: newVideos.map((m) => ({ url: m.url, publicId: m.publicId, posterUrl: m.posterUrl })),
      });
      toast.success(furniture ? "Design updated" : "Design created");
      router.push(destination);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please check the form.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-inkMuted">
            {categoryName ?? "Furniture"}
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            {furniture ? "Edit Design" : "New Design"}
          </h1>
          {categoryName && (
            <p className="mt-1 text-sm text-terra">{categoryName}</p>
          )}
        </div>
        <button onClick={() => router.push(destination)} className="btn-ghost">
          Cancel
        </button>
      </div>

      <form action={action} className="mt-8 space-y-6">
        {/* Core details */}
        <div className="rounded-xl border border-inkBorder bg-white p-6 shadow-sm">
          <h3 className="font-display text-xl font-bold text-ink">Details</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label}>Name</label>
              <input name="name" defaultValue={furniture?.name} required className={field} />
            </div>
            <div>
              <label className={label}>Slug (optional)</label>
              <input name="slug" defaultValue={furniture?.slug} placeholder="auto from name" className={field} />
            </div>
            {defaultCategoryId ? (
              <input type="hidden" name="categoryId" value={defaultCategoryId} />
            ) : (
              <div>
                <label className={label}>Category</label>
                <select
                  name="categoryId"
                  defaultValue={furniture?.categoryId ?? ""}
                  required
                  className={field}
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={label}>Style</label>
              <select name="style" defaultValue={furniture?.style ?? ""} className={field}>
                <option value="">—</option>
                {styles.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Wood type</label>
              <select name="woodType" defaultValue={furniture?.woodType ?? ""} className={field}>
                <option value="">—</option>
                {woods.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Finish</label>
              <input name="finish" defaultValue={furniture?.finish ?? ""} placeholder="e.g. Matte lacquer" className={field} />
            </div>
            <div>
              <label className={label}>Dimensions</label>
              <input name="dimensions" defaultValue={furniture?.dimensions ?? ""} placeholder='e.g. 84" W × 36" D × 32" H' className={field} />
            </div>
            <div>
              <label className={label}>Available sizes</label>
              <input name="sizes" defaultValue={furniture?.sizes ?? ""} placeholder="e.g. 2-seater, 3-seater, L-shape" className={field} />
            </div>
            <div>
              <label className={label}>Finish options</label>
              <input name="finishOptions" defaultValue={furniture?.finishOptions ?? ""} placeholder="e.g. Walnut, Mahogany, Natural Ash" className={field} />
            </div>
            <div>
              <label className={label}>Delivery time</label>
              <input name="deliveryTime" defaultValue={furniture?.deliveryTime ?? ""} placeholder="e.g. 4–6 weeks" className={field} />
            </div>
            <div>
              <label className={label}>Starting price (PKR)</label>
              <input name="startingPrice" type="number" defaultValue={furniture?.startingPrice ?? ""} placeholder="e.g. 45000" className={field} />
            </div>
            <div>
              <label className={label}>Sort order</label>
              <input name="sortOrder" type="number" defaultValue={furniture?.sortOrder ?? 0} className={field} />
            </div>
          </div>

          <div className="mt-5">
            <label className={label}>Short description (shown on cards)</label>
            <input name="shortDesc" defaultValue={furniture?.shortDesc ?? ""} className={field} />
          </div>
          <div className="mt-5">
            <label className={label}>Full description</label>
            <textarea name="description" defaultValue={furniture?.description ?? ""} rows={4} className={field} />
          </div>
          <div className="mt-5">
            <label className={label}>Features (one per line)</label>
            <textarea
              name="features"
              defaultValue={parseList(furniture?.features).join("\n")}
              rows={4}
              placeholder={"Solid Sheesham frame\nHand-carved detailing\nCustom upholstery available"}
              className={field}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input name="featured" type="checkbox" defaultChecked={furniture?.featured} className="h-4 w-4 accent-terra" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input name="bestSeller" type="checkbox" defaultChecked={furniture?.bestSeller} className="h-4 w-4 accent-terra" />
              Best seller
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input name="published" type="checkbox" defaultChecked={furniture?.published ?? true} className="h-4 w-4 accent-terra" />
              Published
            </label>
          </div>
        </div>

        {/* Existing media */}
        {furniture && (furniture.images.length > 0 || furniture.videos.length > 0) && (
          <div className="rounded-xl border border-inkBorder bg-white p-6 shadow-sm">
            <h3 className="font-display text-xl font-bold text-ink">Current media</h3>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {furniture.images.map((img, index) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border border-inkBorder">
                  <Image src={img.url} alt="" fill className="object-cover" />
                  {img.isPrimary && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-sans font-medium uppercase tracking-wider text-terra shadow-sm">
                      Primary
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(furniture.id, index)}
                        title="Set as primary"
                        className="rounded-full bg-white p-2 text-terra shadow"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteImage(furniture.id, index)}
                      title="Delete"
                      className="rounded-full bg-red-500 p-2 text-white shadow"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {furniture.videos.map((v) => (
                <div key={v.id} className="group relative aspect-square overflow-hidden rounded-lg border border-inkBorder bg-stone">
                  <video src={v.url} className="h-full w-full object-cover" />
                  <span className="absolute left-1.5 top-1.5">
                    <Film className="h-4 w-4 text-inkMuted" />
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => deleteVideo(furniture.id)}
                      className="rounded-full bg-red-500 p-2 text-white shadow"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload new media */}
        <div className="rounded-xl border border-inkBorder bg-white p-6 shadow-sm">
          <h3 className="font-display text-xl font-bold text-ink">Add images & video</h3>
          <p className="mb-4 mt-1 text-sm text-inkMuted">
            Images are optimised and compressed automatically by Cloudinary. The first image becomes the primary if none exists.
          </p>
          <MediaUploader
            resourceType="auto"
            onUploaded={(items) => {
              const imgs = items.filter((i) => i.type === "image");
              const vids = items.filter((i) => i.type === "video");
              if (imgs.length) setNewImages((p) => [...p, ...imgs]);
              if (vids.length) setNewVideos((p) => [...p, ...vids]);
            }}
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-terra disabled:opacity-60">
            {saving ? "Saving…" : "Save Design"}
          </button>
        </div>
      </form>
    </div>
  );
}
