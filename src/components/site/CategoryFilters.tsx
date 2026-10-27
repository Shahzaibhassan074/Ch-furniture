"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { STYLES, WOOD_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CategoryFilters() {
  const router    = useRouter();
  const pathname  = usePathname();
  const params    = useSearchParams();
  const activeStyle = params.get("style") || "";
  const activeWood  = params.get("wood")  || "";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && next.get(key) !== value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3.5 py-1.5 text-[11px] font-sans font-medium uppercase tracking-wider transition-all",
      active
        ? "border-terra bg-terra text-white"
        : "border-inkBorder bg-parchment text-inkMuted hover:border-terra/60 hover:text-terra"
    );

  return (
    /* Mobile: single horizontally-scrollable row. Desktop: wrapping rows. */
    <div className="no-scrollbar overflow-x-auto md:overflow-visible">
      <div className="flex w-max flex-nowrap items-center gap-4 pb-0.5 md:w-auto md:flex-wrap md:pb-0">
        {/* Style */}
        <div className="flex flex-none items-center gap-1.5">
          <span className="mr-1 text-[10px] font-sans uppercase tracking-widest2 text-inkMuted">Style</span>
          <button onClick={() => setParam("style", "")} className={chip(!activeStyle)}>All</button>
          {STYLES.map((s) => (
            <button key={s} onClick={() => setParam("style", s)} className={chip(activeStyle === s)}>
              {s}
            </button>
          ))}
        </div>

        {/* Wood */}
        <div className="flex flex-none items-center gap-1.5">
          <span className="mr-1 text-[10px] font-sans uppercase tracking-widest2 text-inkMuted">Wood</span>
          <button onClick={() => setParam("wood", "")} className={chip(!activeWood)}>All</button>
          {WOOD_TYPES.map((w) => (
            <button key={w} onClick={() => setParam("wood", w)} className={chip(activeWood === w)}>
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
