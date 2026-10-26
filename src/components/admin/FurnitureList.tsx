"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, EyeOff } from "lucide-react";
import { deleteFurniture } from "@/app/actions/admin";

type Row = {
  id: string;
  slug: string;
  name: string;
  published: boolean;
  featured: boolean;
  bestSeller: boolean;
  category: { name: string } | null;
  images: { url: string; isPrimary: boolean }[];
};

export function FurnitureList({ items }: { items: Row[] }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-inkMuted">Catalog</p>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">All Furniture</h1>
          <p className="mt-1 text-sm text-inkMuted">{items.length} designs</p>
        </div>
        <Link href="/admin/categories" className="btn-terra">
          <Plus className="h-4 w-4" />
          Add via Categories
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-inkBorder bg-white shadow-sm">
        {items.length === 0 ? (
          <div className="p-16 text-center text-inkMuted">
            No designs yet. Add your first piece through a Category.
          </div>
        ) : (
          items.map((it) => {
            const img = it.images.find((i) => i.isPrimary)?.url ?? it.images[0]?.url;
            return (
              <div
                key={it.id}
                className="flex items-center gap-4 border-b border-inkBorder/60 p-3 last:border-0 hover:bg-stone/30 transition-colors"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone">
                  {img && <Image src={img} alt="" fill className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{it.name}</p>
                  <p className="text-xs text-inkMuted">{it.category?.name ?? "—"} · /{it.slug}</p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  {it.featured && <Star className="h-3.5 w-3.5 fill-terra text-terra" />}
                  {it.bestSeller && (
                    <span className="rounded-full bg-blush px-2 py-0.5 text-[10px] font-sans font-medium uppercase tracking-wider text-terra">
                      Best
                    </span>
                  )}
                  {!it.published && <EyeOff className="h-3.5 w-3.5 text-inkMuted" />}
                </div>
                <Link
                  href={`/admin/furniture/${it.id}`}
                  className="flex items-center gap-1.5 rounded-lg border border-inkBorder px-3 py-1.5 text-xs font-medium text-inkMuted transition-colors hover:border-terra/40 hover:text-terra"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </Link>
                <DeleteBtn id={it.id} name={it.name} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function DeleteBtn({ id, name }: { id: string; name: string }) {
  const [confirm, setConfirm] = useState(false);
  return confirm ? (
    <button
      onClick={async () => {
        try { await deleteFurniture(id); toast.success(`Deleted ${name}`); }
        catch { toast.error("Delete failed"); }
      }}
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600"
    >
      Confirm?
    </button>
  ) : (
    <button
      onClick={() => setConfirm(true)}
      className="rounded-lg border border-inkBorder p-1.5 text-inkMuted transition-colors hover:border-red-200 hover:text-red-500"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
