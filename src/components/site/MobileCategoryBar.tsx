"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { MobileFilterSheet } from "@/components/site/MobileFilterSheet";
import { Suspense } from "react";

type Props = {
  count: number;
};

function MobileCategoryBarInner({ count }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="font-sans text-[13px] text-inkMuted">
          <span className="font-semibold text-ink">{count}</span> designs
        </p>
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-1.5 rounded-full border border-inkBorder bg-parchment px-3.5 py-2 text-[12px] font-sans font-medium text-inkMuted active:bg-stone"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter
        </button>
      </div>

      <Suspense fallback={null}>
        <MobileFilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} />
      </Suspense>
    </>
  );
}

export function MobileCategoryBar({ count }: Props) {
  return (
    <div className="md:hidden">
      <MobileCategoryBarInner count={count} />
    </div>
  );
}
