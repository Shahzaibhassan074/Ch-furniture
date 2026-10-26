"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Star, Film, FolderOpen } from "lucide-react";
import { MediaUploader, type UploadedMedia } from "@/components/admin/MediaUploader";
import { upsertCategory, deleteCategory } from "@/app/actions/admin";

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  bannerUrl: string | null;
  thumbUrl: string | null;
  heroVideoUrl: string | null;
  heroVideoPosterUrl: string | null;
  sortOrder: number;
  featured: boolean;
  videoMode: boolean;
  _count?: { furniture: number };
};

const field =
  "w-full rounded-lg border border-inkBorder bg-white px-4 py-2.5 text-ink placeholder:text-inkMuted/60 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra/20 transition-colors";
const label = "block text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted mb-1.5";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  const showForm = creating || editing !== null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-inkMuted">Catalog</p>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">Categories</h1>
          <p className="mt-1 text-sm text-inkMuted">{categories.length} categories</p>
        </div>
        {!showForm && (
          <button onClick={() => setCreating(true)} className="btn-terra">
            <Plus className="h-4 w-4" /> Add Category
          </button>
        )}
      </div>

      {showForm ? (
        <CategoryForm
          category={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="overflow-hidden rounded-xl border border-inkBorder bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Clickable image → opens folder */}
              <Link
                href={`/admin/categories/${c.id}`}
                className="group relative block aspect-video bg-stone"
              >
                {c.thumbUrl || c.bannerUrl ? (
                  <Image
                    src={(c.thumbUrl || c.bannerUrl)!}
                    alt={c.name}
                    fill
                    className="object-cover transition-opacity group-hover:opacity-80"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-inkMuted">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                  <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-ink shadow opacity-0 transition-opacity group-hover:opacity-100">
                    <FolderOpen className="h-3.5 w-3.5 text-terra" />
                    Open
                  </span>
                </div>
                {c.featured && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-sans font-medium uppercase tracking-wider text-terra shadow-sm">
                    <Star className="h-3 w-3 fill-terra" /> Featured
                  </span>
                )}
              </Link>

              <div className="p-4">
                <Link href={`/admin/categories/${c.id}`} className="group/name block">
                  <h3 className="font-display text-xl font-bold text-ink transition-colors group-hover/name:text-terra">
                    {c.name}
                  </h3>
                  <p className="text-xs text-inkMuted">
                    {c._count?.furniture ?? 0} designs · /{c.slug}
                  </p>
                </Link>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/admin/categories/${c.id}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blush py-2 text-xs font-medium text-terra transition-colors hover:bg-terra/20"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    Open Folder
                  </Link>
                  <button
                    onClick={() => setEditing(c)}
                    className="flex items-center justify-center rounded-lg border border-inkBorder px-3 py-2 text-xs text-inkMuted transition-colors hover:border-terra/40 hover:text-terra"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <DeleteButton id={c.id} name={c.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryForm({
  category,
  onClose,
}: {
  category: Category | null;
  onClose: () => void;
}) {
  const [banner, setBanner] = useState(category?.bannerUrl || "");
  const [thumb, setThumb] = useState(category?.thumbUrl || "");
  const [heroVideo, setHeroVideo] = useState(category?.heroVideoUrl || "");
  const [heroVideoPoster, setHeroVideoPoster] = useState(
    category?.heroVideoPosterUrl || ""
  );
  const [saving, setSaving] = useState(false);

  async function action(formData: FormData) {
    setSaving(true);
    formData.set("bannerUrl", banner);
    formData.set("thumbUrl", thumb);
    formData.set("heroVideoUrl", heroVideo);
    formData.set("heroVideoPosterUrl", heroVideoPoster);
    try {
      await upsertCategory(category?.id ?? null, formData);
      toast.success(category ? "Category updated" : "Category created");
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 rounded-xl border border-inkBorder bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-ink">
          {category ? "Edit Category" : "New Category"}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-lg p-1 text-inkMuted transition-colors hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form action={action} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Name</label>
            <input name="name" defaultValue={category?.name} required className={field} />
          </div>
          <div>
            <label className={label}>Slug (optional)</label>
            <input
              name="slug"
              defaultValue={category?.slug}
              placeholder="auto from name"
              className={field}
            />
          </div>
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea
            name="description"
            defaultValue={category?.description ?? ""}
            rows={3}
            className={field}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Sort order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={category?.sortOrder ?? 0}
              className={field}
            />
          </div>
          <div className="flex flex-col gap-3 pt-7">
            <label className="flex items-center gap-3 text-sm text-ink">
              <input
                name="featured"
                type="checkbox"
                defaultChecked={category?.featured}
                className="h-4 w-4 accent-terra"
              />
              Featured on homepage
            </label>
            <label className="flex items-center gap-3 text-sm text-ink">
              <input
                name="videoMode"
                type="checkbox"
                defaultChecked={category?.videoMode}
                className="h-4 w-4 accent-terra"
              />
              <span>
                Video grid mode{" "}
                <span className="text-xs text-inkMuted">
                  (shows autoplaying videos instead of images)
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Thumbnail (card image)</label>
            {thumb && (
              <div className="relative mb-2 aspect-video overflow-hidden rounded-lg">
                <Image src={thumb} alt="" fill className="object-cover" />
              </div>
            )}
            <MediaUploader
              resourceType="image"
              onUploaded={(m: UploadedMedia[]) => m[0] && setThumb(m[0].url)}
            />
          </div>
          <div>
            <label className={label}>Banner (category page hero image)</label>
            {banner && (
              <div className="relative mb-2 aspect-video overflow-hidden rounded-lg">
                <Image src={banner} alt="" fill className="object-cover" />
              </div>
            )}
            <MediaUploader
              resourceType="image"
              onUploaded={(m: UploadedMedia[]) => m[0] && setBanner(m[0].url)}
            />
          </div>
        </div>

        <div className="rounded-xl border border-terra/20 bg-blush/30 p-4">
          <label className="mb-1.5 flex items-center gap-2 text-[11px] font-sans font-medium uppercase tracking-wider text-terra">
            <Film className="h-3.5 w-3.5" /> Hero Video
          </label>
          <p className="mb-3 text-xs text-inkMuted">
            Auto-plays at the top of the category page instead of the banner. Upload an MP4.
          </p>
          {heroVideo ? (
            <div className="mb-3">
              <video
                src={heroVideo}
                poster={heroVideoPoster || undefined}
                className="max-h-48 w-full rounded-lg object-cover"
                controls
              />
              <button
                type="button"
                onClick={() => {
                  setHeroVideo("");
                  setHeroVideoPoster("");
                }}
                className="mt-1.5 text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                Remove video
              </button>
            </div>
          ) : null}
          <MediaUploader
            resourceType="video"
            onUploaded={(m: UploadedMedia[]) => {
              if (m[0]) {
                setHeroVideo(m[0].url);
                if (m[0].posterUrl) setHeroVideoPoster(m[0].posterUrl);
              }
            }}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-terra disabled:opacity-60">
            {saving ? "Saving…" : "Save Category"}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  async function onDelete() {
    try {
      await deleteCategory(id);
      toast.success(`Deleted ${name}`);
    } catch {
      toast.error("Could not delete category.");
    }
  }
  return confirming ? (
    <button
      onClick={onDelete}
      className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
    >
      Confirm?
    </button>
  ) : (
    <button
      onClick={() => setConfirming(true)}
      aria-label="Delete"
      className="flex items-center justify-center rounded-lg border border-inkBorder px-3 py-2 text-inkMuted transition-colors hover:border-red-200 hover:text-red-500"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
