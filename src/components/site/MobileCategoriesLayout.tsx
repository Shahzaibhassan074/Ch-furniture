"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { STYLES, WOOD_TYPES } from "@/lib/constants";

type CategoryItem = {
  id?: string;
  slug: string;
  name: string;
  description: string | null;
  thumbUrl: string | null;
  bannerUrl?: string | null;
  count: number;
};

type Props = {
  categories: CategoryItem[];
};

export function MobileCategoriesLayout({ categories }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  const selectedSlug = params.get("c") ?? categories[0]?.slug ?? "";
  const selected = categories.find((c) => c.slug === selectedSlug) ?? categories[0] ?? null;

  return (
    <div className="flex h-[calc(100vh-120px)] md:hidden">
      {/* Left rail */}
      <div className="w-[108px] shrink-0 bg-stone overflow-y-auto border-r border-inkBorder">
        {categories.map((cat) => {
          const isSelected = cat.slug === selectedSlug;
          return (
            <button
              key={cat.slug}
              onClick={() =>
                router.push(`${pathname}?c=${cat.slug}`, { scroll: false })
              }
              className={cn(
                "w-full px-3 py-4 text-left text-[12px] font-sans font-medium leading-tight border-b border-inkBorder/40 transition-colors",
                isSelected
                  ? "text-terra border-l-[3px] border-l-terra bg-cream pl-[9px]"
                  : "text-inkMuted"
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto bg-cream">
        {selected && (
          <div className="p-4">
            {/* Banner image */}
            {(selected.bannerUrl ?? selected.thumbUrl) && (
              <div className="relative h-40 rounded-2xl overflow-hidden bg-stone mb-4">
                <Image
                  src={(selected.bannerUrl ?? selected.thumbUrl)!}
                  alt={selected.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 70vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="font-display text-[18px] font-bold text-white">{selected.name}</p>
                  <p className="text-[12px] text-white/70">{selected.count} pieces</p>
                </div>
              </div>
            )}

            {/* Shop link */}
            <Link
              href={`/category/${selected.slug}`}
              className="btn-terra w-full justify-center mb-5 text-[14px]"
            >
              Shop {selected.name} <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Shop by style */}
            <p className="eyebrow mb-3">Shop by style</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {STYLES.map((style) => (
                <Link
                  key={style}
                  href={`/category/${selected.slug}?style=${encodeURIComponent(style)}`}
                  className="rounded-xl border border-inkBorder bg-parchment p-2.5 text-center text-[11px] font-sans font-medium text-inkMuted hover:border-terra hover:text-terra transition-colors"
                >
                  {style}
                </Link>
              ))}
            </div>

            {/* Shop by wood */}
            <p className="eyebrow mb-3">Shop by wood</p>
            <div className="flex flex-wrap gap-2">
              {WOOD_TYPES.map((wood) => (
                <Link
                  key={wood}
                  href={`/category/${selected.slug}?wood=${encodeURIComponent(wood)}`}
                  className="rounded-full border border-inkBorder bg-parchment px-3 py-1.5 text-[11px] font-sans font-medium text-inkMuted hover:border-terra hover:text-terra transition-colors"
                >
                  {wood}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
