"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type FavouriteItem = {
  slug:         string;
  name:         string;
  imageUrl:     string | null;
  categorySlug: string;
  categoryName?: string;
};

type FavouritesContextValue = {
  items:   FavouriteItem[];
  toggle:  (item: FavouriteItem) => void;
  has:     (slug: string) => boolean;
  count:   number;
  mounted: boolean;
  toast:   { id: number; message: string } | null;
};

const STORAGE_KEY = "ch_favourites";

function safeRead(): FavouriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function safeWrite(items: FavouriteItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [items,   setItems]   = useState<FavouriteItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [toast,   setToast]   = useState<{ id: number; message: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setItems(safeRead());
    setMounted(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(safeRead());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const toggle = useCallback((item: FavouriteItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.slug === item.slug);
      const next   = exists ? prev.filter((i) => i.slug !== item.slug) : [...prev, item];
      safeWrite(next);
      showToast(exists ? "Removed from favourites" : "Saved to favourites");
      return next;
    });
  }, [showToast]);

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);

  return (
    <FavouritesContext.Provider value={{ items, toggle, has, count: items.length, mounted, toast }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites(): FavouritesContextValue {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used inside <FavouritesProvider>");
  return ctx;
}

/* Floating toast — mount once inside SiteShell */
export function FavouritesToast() {
  const { toast } = useFavourites();
  if (!toast) return null;
  return (
    <div
      key={toast.id}
      className="fixed bottom-24 left-1/2 z-[200] -translate-x-1/2 pointer-events-none"
    >
      <div className="animate-[fadeInUp_0.2s_ease_forwards] rounded-full bg-ink/90 px-5 py-2.5 text-[13px] font-sans text-white whitespace-nowrap shadow-lg">
        {toast.message}
      </div>
    </div>
  );
}
