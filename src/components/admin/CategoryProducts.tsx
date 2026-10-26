"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Plus, Upload, Pencil, Trash2 } from "lucide-react";
import { deleteFurniture } from "@/app/actions/admin";

type Category = { id: string; name: string; slug: string };
type Item = {
  id: string;
  name: string;
  published: boolean;
  featured: boolean;
  bestSeller: boolean;
  images: { url: string; isPrimary: boolean }[];
};

export function CategoryProducts({
  category,
  items,
}: {
  category: Category;
  items: Item[];
}) {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-inkMuted">
        <Link
          href="/admin/categories"
          className="flex items-center gap-1.5 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Categories
        </Link>
        <span>/</span>
        <span className="text-ink">{category.name}</span>
      </div>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-ink">{category.name}</h1>
          <p className="mt-1 text-sm text-inkMuted">
            {items.length} design{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/categories/${category.id}/bulk`}
            className="flex items-center gap-2 rounded-lg border border-inkBorder px-4 py-2.5 text-sm font-medium text-inkMuted transition-colors hover:border-terra/40 hover:text-terra"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Link>
          <Link href={`/admin/categories/${category.id}/new`} className="btn-terra">
            <Plus className="h-4 w-4" />
            Add Design
          </Link>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-inkBorder bg-white p-16 text-center shadow-sm">
          <p className="text-inkMuted">No designs in this category yet.</p>
          <Link
            href={`/admin/categories/${category.id}/new`}
            className="btn-terra mt-5 inline-flex"
          >
            <Plus className="h-4 w-4" />
            Add First Design
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const thumb =
              item.images.find((i) => i.isPrimary)?.url ?? item.images[0]?.url;
            return (
              <ProductCard
                key={item.id}
                item={item}
                thumb={thumb}
                categoryId={category.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  item,
  thumb,
  categoryId,
}: {
  item: Item;
  thumb?: string;
  categoryId: string;
}) {
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-inkBorder bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Photo */}
      <div className="relative aspect-square bg-stone">
        {thumb ? (
          <Image src={thumb} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-inkMuted">
            No image
          </div>
        )}
        {/* Status badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {item.featured && (
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-sans font-medium uppercase tracking-wider text-terra shadow-sm">
              Featured
            </span>
          )}
          {item.bestSeller && (
            <span className="rounded-full bg-blush/90 px-2 py-0.5 text-[9px] font-sans font-medium uppercase tracking-wider text-terra shadow-sm">
              Best
            </span>
          )}
          {!item.published && (
            <span className="rounded-full bg-red-50/90 px-2 py-0.5 text-[9px] font-sans font-medium uppercase tracking-wider text-red-500 shadow-sm">
              Hidden
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3">
        <p className="truncate text-sm font-medium text-ink">{item.name}</p>
        <div className="mt-2 flex gap-2">
          <Link
            href={`/admin/furniture/${item.id}?from=/admin/categories/${categoryId}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-inkBorder py-1.5 text-xs text-inkMuted transition-colors hover:border-terra/40 hover:text-terra"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Link>
          {confirm ? (
            <button
              onClick={async () => {
                try {
                  await deleteFurniture(item.id);
                  toast.success(`Deleted ${item.name}`);
                } catch {
                  toast.error("Delete failed");
                }
              }}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600"
            >
              Sure?
            </button>
          ) : (
            <button
              onClick={() => setConfirm(true)}
              className="rounded-lg border border-inkBorder px-3 py-1.5 text-inkMuted transition-colors hover:border-red-200 hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
