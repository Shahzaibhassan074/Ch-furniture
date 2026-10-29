"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFavourites, type FavouriteItem } from "@/context/favourites-context";
import { useState } from "react";

type Props = {
  item:      FavouriteItem;
  className?: string;
};

export function FavouriteButton({ item, className }: Props) {
  const { toggle, has, mounted } = useFavourites();
  const [pulse, setPulse] = useState(false);

  if (!mounted) return null;

  const saved = has(item.slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPulse(true);
    setTimeout(() => setPulse(false), 150);
    toggle(item);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from favourites" : "Save to favourites"}
      animate={{ scale: pulse ? 0.82 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className={cn(
        "flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white shadow-md transition-colors duration-150",
        saved ? "text-terra" : "text-inkMuted hover:text-terra",
        className
      )}
    >
      <Heart
        className="h-4 w-4"
        fill={saved ? "currentColor" : "none"}
        strokeWidth={2}
      />
    </motion.button>
  );
}
