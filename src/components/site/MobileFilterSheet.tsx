"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { STYLES, WOOD_TYPES } from "@/lib/constants";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileFilterSheet({ open, onClose }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  const activeStyle = params.get("style") ?? "";
  const activeWood  = params.get("wood")  ?? "";
  const hasFilters  = !!(activeStyle || activeWood);

  /* Esc to close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* Scroll lock */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && next.get(key) !== value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function clearAll() {
    const next = new URLSearchParams(params.toString());
    next.delete("style");
    next.delete("wood");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.y > 80) onClose();
  }

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3.5 py-2 text-[12px] font-sans font-medium transition-all",
      active
        ? "border-terra bg-terra text-white"
        : "border-inkBorder bg-parchment text-inkMuted hover:border-terra/60 hover:text-terra"
    );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-ink/50 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[71] rounded-t-[24px] bg-cream md:hidden"
            style={{ maxHeight: "85dvh", overflowY: "auto" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-inkBorder" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-inkBorder">
              <h2 className="font-display text-[18px] font-bold text-ink">Filters</h2>
              <div className="flex items-center gap-2">
                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="text-[13px] font-sans font-medium text-terra"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close filters"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-inkBorder text-inkMuted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="px-5 py-5 space-y-6">
              {/* Style */}
              <div>
                <p className="text-[10px] font-sans font-medium uppercase tracking-widest2 text-inkMuted mb-3">
                  Style
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setParam("style", "")} className={chip(!activeStyle)}>
                    All
                  </button>
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setParam("style", s)}
                      className={chip(activeStyle === s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wood */}
              <div>
                <p className="text-[10px] font-sans font-medium uppercase tracking-widest2 text-inkMuted mb-3">
                  Wood Type
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setParam("wood", "")} className={chip(!activeWood)}>
                    All
                  </button>
                  {WOOD_TYPES.map((w) => (
                    <button
                      key={w}
                      onClick={() => setParam("wood", w)}
                      className={chip(activeWood === w)}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-8">
              <button
                onClick={onClose}
                className="btn-terra w-full justify-center h-[52px] text-[15px]"
              >
                Show results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
