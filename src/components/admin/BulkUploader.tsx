"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { MediaUploader, type UploadedMedia } from "@/components/admin/MediaUploader";
import { bulkCreateDesigns } from "@/app/actions/admin";

type PendingItem = UploadedMedia & { customName: string };

export function BulkUploader({ category }: { category: { id: string; name: string } }) {
  const router = useRouter();
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [saving, setSaving] = useState(false);

  function handleUploaded(items: UploadedMedia[]) {
    const withNames = items
      .filter((m) => m.type === "image")
      .map((m, i) => ({
        ...m,
        customName: `${category.name} Design ${pending.length + i + 1}`,
      }));
    setPending((p) => [...p, ...withNames]);
  }

  function updateName(idx: number, name: string) {
    setPending((p) =>
      p.map((item, i) => (i === idx ? { ...item, customName: name } : item))
    );
  }

  function removeItem(idx: number) {
    setPending((p) => p.filter((_, i) => i !== idx));
  }

  async function saveAll() {
    if (!pending.length) return;
    setSaving(true);
    try {
      await bulkCreateDesigns(
        category.id,
        pending.map((p) => ({
          url: p.url,
          publicId: p.publicId,
          name: p.customName.trim() || `${category.name} Design`,
        }))
      );
      toast.success(
        `${pending.length} design${pending.length !== 1 ? "s" : ""} added to ${category.name}`
      );
      router.push(`/admin/categories/${category.id}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-inkMuted">
        <Link
          href={`/admin/categories/${category.id}`}
          className="flex items-center gap-1.5 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {category.name}
        </Link>
        <span>/</span>
        <span className="text-ink">Bulk Upload</span>
      </div>

      <div className="mt-4">
        <h1 className="font-display text-4xl font-bold text-ink">Bulk Upload</h1>
        <p className="mt-1 text-sm text-inkMuted">
          Upload multiple designs directly into{" "}
          <span className="font-medium text-terra">{category.name}</span>. Edit names, then save all at once.
        </p>
      </div>

      {/* Uploader */}
      <div className="mt-8 rounded-xl border border-inkBorder bg-white p-6 shadow-sm">
        <p className="mb-4 text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted">
          Select Images — you can pick 10–20 at once
        </p>
        <MediaUploader resourceType="image" onUploaded={handleUploaded} />
      </div>

      {/* Staging grid */}
      {pending.length > 0 && (
        <>
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-inkMuted">
              {pending.length} image{pending.length !== 1 ? "s" : ""} ready — edit names below if needed
            </p>
            <button
              onClick={saveAll}
              disabled={saving}
              className="btn-terra disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : `Save ${pending.length} Designs`}
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pending.map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-inkBorder bg-white shadow-sm"
              >
                <div className="relative aspect-square bg-stone">
                  <Image src={item.url} alt={item.customName} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-inkMuted shadow-sm transition-colors hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-3">
                  <input
                    value={item.customName}
                    onChange={(e) => updateName(idx, e.target.value)}
                    className="w-full rounded-lg border border-inkBorder bg-white px-3 py-2 text-sm text-ink placeholder:text-inkMuted/60 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra/20 transition-colors"
                    placeholder="Design name"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom save button */}
          <div className="mt-6">
            <button
              onClick={saveAll}
              disabled={saving}
              className="btn-terra disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : `Save ${pending.length} Designs`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
