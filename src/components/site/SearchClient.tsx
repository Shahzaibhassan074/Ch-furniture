"use client";

import { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon } from "lucide-react";
import { FurnitureCard, type FurnitureCardData } from "@/components/site/FurnitureCard";

export function SearchClient({ whatsapp }: { whatsapp: string }) {
  const [q,       setQ]       = useState("");
  const [results, setResults] = useState<FurnitureCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const run = useCallback(async (term: string) => {
    if (!term.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
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
      <div className="relative">
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
          /* Branded three-dot indicator — matches page loader color */
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

      <div className="mt-10">
        {q.trim() && !loading && results.length === 0 && touched && (
          <p className="text-center text-inkMuted">
            No designs found for "{q}". Try another term or{" "}
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
