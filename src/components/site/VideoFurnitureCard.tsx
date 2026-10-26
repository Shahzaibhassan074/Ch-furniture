"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { MessageCircle, ArrowUpRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { whatsappUrl } from "@/lib/utils";

export type VideoFurnitureCardData = {
  slug:           string;
  name:           string;
  style?:         string | null;
  woodType?:      string | null;
  shortDesc?:     string | null;
  categorySlug:   string;
  imageUrl?:      string | null;
  videoUrl?:      string | null;
  videoPosterUrl?: string | null;
};

export function VideoFurnitureCard({
  item,
  whatsapp,
  index = 0,
}: {
  item:     VideoFurnitureCardData;
  whatsapp: string;
  index?:   number;
}) {
  const detailHref = `/category/${item.categorySlug}/${item.slug}`;
  const waMessage  = `Hello CH Furniture House,\nI'm interested in the ${item.name}. Please send pricing, available wood options and customization options.`;
  const videoRef   = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const hasVideo = !!item.videoUrl && !videoError;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group overflow-hidden rounded-2xl border border-inkBorder bg-parchment transition-shadow hover:shadow-md"
    >
      <Link href={detailHref} className="block">
        <div className="relative aspect-square overflow-hidden bg-stone">
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={item.videoUrl!}
                poster={item.videoPosterUrl || item.imageUrl || undefined}
                autoPlay loop muted playsInline
                onError={() => setVideoError(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-sans font-medium text-white backdrop-blur">
                <Play className="h-2.5 w-2.5 fill-white" /> Video
              </span>
            </>
          ) : item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill loading="lazy"
              sizes="(max-width:768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-inkMuted">No media</div>
          )}
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
          <a
            href={whatsappUrl(whatsapp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask on WhatsApp"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-80"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
