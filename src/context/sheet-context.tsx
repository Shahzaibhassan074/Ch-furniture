"use client";

import { createContext, useCallback, useContext, useState } from "react";

type WAContext = {
  productName?: string;
  productUrl?: string;
};

type SheetContextValue = {
  /** WhatsApp sheet */
  waOpen: boolean;
  openWA: (ctx?: WAContext) => void;
  closeWA: () => void;
  waContext: WAContext | null;
  /** Mobile nav drawer */
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  /** Product lightbox */
  lightboxOpen: boolean;
  setLightboxOpen: (v: boolean) => void;
};

const SheetContext = createContext<SheetContextValue | null>(null);

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [waOpen, setWaOpen] = useState(false);
  const [waContext, setWaContext] = useState<WAContext | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openWA = useCallback((ctx?: WAContext) => {
    setWaContext(ctx ?? null);
    setWaOpen(true);
  }, []);

  const closeWA = useCallback(() => {
    setWaOpen(false);
  }, []);

  return (
    <SheetContext.Provider
      value={{
        waOpen,
        openWA,
        closeWA,
        waContext,
        drawerOpen,
        setDrawerOpen,
        lightboxOpen,
        setLightboxOpen,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
}

export function useSheet(): SheetContextValue {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet must be used inside <SheetProvider>");
  return ctx;
}
