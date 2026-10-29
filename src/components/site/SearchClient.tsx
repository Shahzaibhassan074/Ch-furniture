"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search as SearchIcon, ChevronRight } from "lucide-react";
import { FurnitureCard, type FurnitureCardData } from "@/components/site/FurnitureCard";

const POPULAR_TERMS = [
  "Jahez bed set",
  "Sheesham bed",
  "L-shaped sofa",
  "Dining 6 seater",
  "Dewan",
];

type FeaturedCategory = {
  slug: string;
  name: string;
  thumbUrl: string | null;
};

type FeaturedProduct = {
  slug: string;
  name: string;
  categorySlug: string;
  imageUrl?: string | null;
  style?: string | null;
};

type Props = {
  whatsapp: string;
  featuredCategories?: FeaturedCategory[];
  featuredProducts?: FeaturedProduct[];
};

export function SearchClient({ whatsapp, featuredCategories, featuredProducts }: Props) {
  const [q,       setQ]       = useState("");
  const [results, setResults] = useState<FurnitureCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const run = useCallback(async (term: string) => {
    if (!term.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await res.json() as { results?: FurnitureCardData[] };
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTouched(true);
    const t = setTimeout(() => run(q), 300);
    return () => clearTimeout(t);
  }, [q, run]);

  return (
    <div>
      {/* Search input row */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-inkMuted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, category, style or wood…"
            aria-label="Search furniture"
            className="w-full rounded-full border border-inkBorder bg-parchment py-4 pl-14 pr-5 text-lg text-ink placeholder:text-inkMuted/60 focus:border-terra focus:outline-none focus:ring-2 focus:ring-terra/20"
          />
          {loading && (
            <span className="absolute right-5 top-1/2 flex -translate-y-1/2 items-end gap-[4px]">
              {[0, 0.15, 0.3].map((delay, i) => (
                <span
                  key={i}
                  className="inline-block h-[6px] w-[6px] rounded-full bg-terra"
                  style={{ animation: `search-dot 0.7s ${delay}s ease-in-out infinite` }}
                />
              ))}
            </span>
          )}
        </div>
        {q && (
          <button
            onClick={() => setQ("")}
            className="md:hidden text-[13px] font-sans text-inkMuted whitespace-nowrap px-2"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Empty state — mobile only */}
      {q === "" && (
        <>
          {/* Popular searches */}
          <div className="md:hidden mt-6">
            <p className="text-[12px] font-sans font-medium uppercase tracking-widest2 text-inkMuted mb-3">
              Popular searches
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TERMS.map((term) => (
                <button
                  key={term}
                  onClick={() => setQ(term)}
                  className="rounded-full border border-inkBorder bg-parchment px-3.5 py-2 text-[13px] font-sans text-inkMuted hover:border-terra hover:text-terra transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Browse collections */}
          {featuredCategories && featuredCategories.length > 0 && (
            <div className="md:hidden mt-7">
              <p className="text-[12px] font-sans font-medium uppercase tracking-widest2 text-inkMuted mb-3">
                Browse collections
              </p>
              <div className="grid grid-cols-4 gap-3">
                {featuredCategories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-stone">
                      {cat.thumbUrl && (
                        <Image
                          src={cat.thumbUrl}
                          alt={cat.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <span className="text-center text-[11px] font-sans text-inkMuted leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Trending now */}
          {featuredProducts && featuredProducts.length > 0 && (
            <div className="md:hidden mt-7">
              <p className="text-[12px] font-sans font-medium uppercase tracking-widest2 text-inkMuted mb-3">
                Trending now
              </p>
              <div className="space-y-3">
                {featuredProducts.slice(0, 4).map((p) => (
                  <Link
                    key={p.slug}
                    href={`/category/${p.categorySlug}/${p.slug}`}
                    className="flex items-center gap-3 rounded-2xl border border-inkBorder bg-parchment p-3"
                  >
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-stone shrink-0">
                      {p.imageUrl && (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[13px] font-medium text-ink truncate">{p.name}</p>
                      {p.style && <p className="text-[11px] text-inkMuted">{p.style}</p>}
                    </div>
                    <ChevronRight className="h-4 w-4 text-inkMuted shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-10">
        {q.trim() && !loading && results.length === 0 && touched && (
          <p className="text-center text-inkMuted">
            No designs found for &ldquo;{q}&rdquo;. Try another term or{" "}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terra underline"
            >
              message us on WhatsApp
            </a>
            .
          </p>
        )}
        {results.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((f, i) => (
              <FurnitureCard key={f.slug} item={f} whatsapp={whatsapp} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
