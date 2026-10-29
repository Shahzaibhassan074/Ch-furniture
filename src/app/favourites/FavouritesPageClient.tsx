"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useFavourites } from "@/context/favourites-context";
import { FavouriteButton } from "@/components/site/FavouriteButton";
import { whatsappUrl } from "@/lib/utils";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";

export function FavouritesPageClient({ whatsapp }: { whatsapp: string }) {
  const { items, count, mounted } = useFavourites();

  if (!mounted) return <div className="container-px pt-32 pb-20 min-h-[60vh]" />;

  const waMessage =
    count > 0
      ? `Assalam-o-Alaikum CH Furniture House, I like these designs:\n${items
          .map((it, i) => `${i + 1}. ${it.name} – ${SITE}/category/${it.categorySlug}/${it.slug}`)
          .join("\n")}\nPlease share details.`
      : "";

  if (count === 0) {
    return (
      <div className="container-px flex min-h-[60vh] flex-col items-center justify-center gap-6 pt-32 pb-20 text-center">
        <Heart className="h-16 w-16 text-inkBorder" strokeWidth={1.5} />
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">No favourites yet</h1>
          <p className="mt-2 text-inkMuted">Tap the heart on any design to save it here.</p>
        </div>
        <Link href="/categories" className="btn-terra mt-2">
          Browse collections
        </Link>
      </div>
    );
  }

  return (
    <div className="container-px pt-32 pb-20">
      <h1 className="font-display text-3xl font-extrabold text-ink">
        Your favourites
        <span className="ml-3 font-sans text-xl font-normal text-inkMuted">({count})</span>
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.slug} className="group relative rounded-2xl border border-inkBorder bg-parchment overflow-hidden">
            <Link href={`/category/${item.categorySlug}/${item.slug}`}>
              <div className="relative aspect-square bg-stone">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-inkMuted">No image</div>
                )}
              </div>
              <div className="p-3">
                <p className="font-display text-[14px] font-semibold text-ink line-clamp-2">{item.name}</p>
                {item.categoryName && (
                  <p className="mt-0.5 text-[11px] font-sans text-inkMuted">{item.categoryName}</p>
                )}
              </div>
            </Link>
            {/* Remove heart */}
            <div className="absolute top-2 right-2">
              <FavouriteButton item={item} />
            </div>
          </div>
        ))}
      </div>

      {/* Send on WhatsApp */}
      <div className="mt-10 flex justify-center">
        <a
          href={whatsappUrl(whatsapp, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-2xl bg-[#25D366] px-8 py-4 text-[15px] font-sans font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Send my list on WhatsApp
        </a>
      </div>
    </div>
  );
}
