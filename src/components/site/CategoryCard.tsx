"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export type CategoryCardData = {
  slug:         string;
  name:         string;
  description?: string | null;
  thumbUrl?:    string | null;
  count?:       number;
};

export function CategoryCard({
  category,
  index = 0,
}: {
  category: CategoryCardData;
  index?:   number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/category/${category.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-inkBorder bg-stone shadow-sm transition-shadow hover:shadow-xl hover:shadow-ink/[0.06]"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {category.thumbUrl ? (
            <>
              <Image
                src={category.thumbUrl}
                alt={category.name}
                fill loading="lazy" quality={75}
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Subtle terra tint on hover */}
              <div className="absolute inset-0 bg-terra/0 group-hover:bg-terra/5 transition-colors duration-300" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-inkSubtle text-inkMuted">
              {category.name}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
          {typeof category.count === "number" && (
            <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-white/20 px-3 py-1 text-[11px] font-sans font-medium text-white backdrop-blur-sm">
              {category.count} pieces
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className="font-display text-lg font-bold text-ink transition-colors group-hover:text-terra">
              {category.name}
            </h3>
            {category.description && (
              <p className="mt-0.5 line-clamp-1 text-xs font-sans text-inkMuted">
                {category.description}
              </p>
            )}
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-inkBorder text-inkMuted transition-all group-hover:border-terra group-hover:bg-terra group-hover:text-white">
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
