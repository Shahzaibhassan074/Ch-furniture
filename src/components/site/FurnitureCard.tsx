"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { whatsappUrl, cn } from "@/lib/utils";
import { FavouriteButton } from "@/components/site/FavouriteButton";

export type FurnitureCardData = {
  slug:         string;
  name:         string;
  style?:       string | null;
  woodType?:    string | null;
  shortDesc?:   string | null;
  categorySlug: string;
  imageUrl?:    string | null;
};

export function FurnitureCard({
  item,
  whatsapp,
  index = 0,
}: {
  item:      FurnitureCardData;
  whatsapp:  string;
  index?:    number;
}) {
  const detailHref = `/category/${item.categorySlug}/${item.slug}`;
  const waMessage  = `Hello CH Furniture House,\nI'm interested in the ${item.name}. Please send pricing, available wood options, and delivery information.`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group overflow-hidden rounded-2xl border border-inkBorder bg-parchment shadow-sm transition-shadow hover:shadow-xl hover:shadow-ink/[0.06]"
    >
      {/* Image */}
      <Link href={detailHref} className="block">
        <div className="relative aspect-square overflow-hidden bg-stone ring-2 ring-terra/0 group-hover:ring-terra/20 transition-all duration-300">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill loading="lazy" quality={75}
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-inkMuted">No image</div>
          )}
          <div className="absolute right-2 top-2 md:hidden">
            <FavouriteButton
              item={{
                slug:         item.slug,
                name:         item.name,
                imageUrl:     item.imageUrl ?? null,
                categorySlug: item.categorySlug,
              }}
            />
          </div>
        </div>
      </Link>

      {/* Card body */}
      <div className="p-4">
        <Link href={detailHref}>
          <h3 className="font-display text-[17px] font-semibold leading-snug text-ink transition-colors group-hover:text-terra line-clamp-2">
            {item.name}
          </h3>
        </Link>
        {(item.style || item.woodType) && (
          <p className="mt-1 text-[12px] font-sans text-inkMuted">
            {[item.style, item.woodType].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="badge-blush">
            <span className="h-1.5 w-1.5 rounded-full bg-terra" />
            Available
          </span>
          <motion.a
            href={whatsappUrl(whatsapp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask on WhatsApp"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.2 }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Horizontal-scroll compact variant ── */
export function FurnitureCardCompact({
  item,
  index = 0,
  card = false,
}: {
  item:   FurnitureCardData;
  index?: number;
  card?:  boolean;
}) {
  const detailHref = `/category/${item.categorySlug}/${item.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={cn(
        /* mobile: fixed width pill; desktop: flex-basis driven by Embla */
        "group w-[220px] shrink-0 sm:w-[260px]",
        "md:w-auto md:shrink-0 md:flex-[0_0_calc((100%_-_48px)_/_3)] lg:flex-[0_0_calc((100%_-_72px)_/_4)]",
        /* card variant */
        card
          ? "bg-white rounded-2xl p-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] md:p-0 md:overflow-hidden md:flex md:flex-col"
          : "md:flex md:flex-col"
      )}
    >
      <Link href={detailHref} className="md:flex md:flex-col md:flex-1">
        {/* Image */}
        <div className={cn(
          "relative aspect-square overflow-hidden bg-stone ring-2 ring-terra/0 group-hover:ring-terra/25 transition-all duration-300",
          card ? "rounded-xl md:rounded-none md:rounded-t-2xl" : "rounded-2xl",
          "md:aspect-[4/5]"
        )}>
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill loading="lazy" quality={70}
              sizes="(max-width:767px) 260px, (max-width:1023px) calc((100vw - 96px) / 3), calc((100vw - 128px) / 4)"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-inkMuted">No image</div>
          )}
          <div className="absolute right-2 top-2 md:hidden">
            <FavouriteButton
              item={{
                slug:         item.slug,
                name:         item.name,
                imageUrl:     item.imageUrl ?? null,
                categorySlug: item.categorySlug,
              }}
            />
          </div>
        </div>

        {/* Text body */}
        <div className={cn(
          "mt-3 px-1",
          card && "mt-2",
          "md:mt-0 md:px-3 md:pt-3 md:pb-3 md:flex md:flex-col md:flex-1"
        )}>
          <h3 className="font-display text-[15px] font-semibold leading-snug text-ink line-clamp-2 group-hover:text-terra transition-colors duration-200 md:min-h-[2.6em]">
            {item.name}
          </h3>
          {/* Always render style line — nbsp keeps height consistent */}
          <p className="mt-0.5 text-[11px] font-sans text-inkMuted">
            {[item.style, item.woodType].filter(Boolean).join(" · ") || " "}
          </p>
          {card ? (
            <span className="badge-blush mt-2 md:mt-auto">
              <span className="h-1.5 w-1.5 rounded-full bg-terra" />
              Available
            </span>
          ) : (
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-sans font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-terra" />
              <span className="text-terra">Available</span>
            </span>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
