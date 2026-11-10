"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type FavItem = {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  image: string;
};

type FavCtx = {
  items: FavItem[];
  toggle: (item: FavItem) => void;
  isFav: (id: string) => boolean;
  count: number;
};

const KEY = "m_favourites";
const Ctx = createContext<FavCtx | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const toggle = useCallback((item: FavItem) => {
    setItems((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      const next = exists
        ? prev.filter((f) => f.id !== item.id)
        : [...prev, item];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const isFav = useCallback(
    (id: string) => items.some((f) => f.id === id),
    [items]
  );

  return (
    <Ctx.Provider value={{ items, toggle, isFav, count: items.length }}>
      {children}
    </Ctx.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFavourites must be inside FavouritesProvider");
  return ctx;
}
