"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  description: string;
}

export function CategoryAbout({ name, description }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="container-px border-t border-inkBorder/30 py-16">
      <div className="mx-auto max-w-[760px]">
        <h2 className="mb-5 font-display text-2xl font-bold text-ink md:text-3xl">
          About {name}
        </h2>

        <div className="relative">
          <p
            className={cn(
              "overflow-hidden text-[15px] leading-[1.7] text-inkMuted md:!max-h-none md:text-base md:leading-[1.75]",
              !expanded ? "max-h-[6.8em]" : "max-h-none"
            )}
          >
            {description}
          </p>

          {!expanded && (
            <>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-stone to-transparent md:hidden" />
              <button
                onClick={() => setExpanded(true)}
                className="relative z-10 mt-1 text-[13px] font-medium text-terra underline-offset-2 hover:underline md:hidden"
              >
                Read more ↓
              </button>
            </>
          )}

          {expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="mt-3 block text-[13px] font-medium text-terra underline-offset-2 hover:underline md:hidden"
            >
              Show less ↑
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
