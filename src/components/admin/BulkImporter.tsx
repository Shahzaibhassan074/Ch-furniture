"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  PackagePlus, CheckCircle2, XCircle, Clock, Database,
  Loader2, ChevronRight, Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Category = { id: string; slug: string; name: string };

type Stats = {
  pending:      number;
  approved:     number;
  rejected:     number;
  historyCount: number;
  perCat:       Record<string, number>;
};

type FetchState = "idle" | "loading" | "done" | "error";

export function BulkImporter({
  categories,
  stats: initialStats,
}: {
  categories: Category[];
  stats:      Stats;
}) {
  const [stats,        setStats]        = useState(initialStats);
  const [fetchStates,  setFetchStates]  = useState<Record<string, FetchState>>({});
  const [fetchCounts,  setFetchCounts]  = useState<Record<string, number>>({});
  const [allProgress,  setAllProgress]  = useState<{ current: number; name: string } | null>(null);

  async function fetchCategory(slug: string, name: string) {
    setFetchStates((s) => ({ ...s, [slug]: "loading" }));
    try {
      const resp = await fetch("/api/admin/bulk-50/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: slug, limit: 50 }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.error ?? "Fetch failed");

      setFetchStates((s) => ({ ...s, [slug]: "done" }));
      setFetchCounts((c) => ({ ...c, [slug]: data.fetched }));
      setStats((s) => ({
        ...s,
        pending: s.pending + data.fetched,
        perCat: { ...s.perCat, [slug]: (s.perCat[slug] ?? 0) + data.fetched },
      }));

      if (data.fetched > 0) {
        toast.success(`${name}: fetched ${data.fetched} new items`);
      } else {
        toast.info(`${name}: no new items found`);
        setFetchStates((s) => ({ ...s, [slug]: "idle" }));
      }

      return data.fetched as number;
    } catch (err: unknown) {
      setFetchStates((s) => ({ ...s, [slug]: "error" }));
      toast.error(`${name}: ${err instanceof Error ? err.message : "failed"}`);
      return 0;
    }
  }

  async function fetchAll() {
    let total = 0;
    for (let i = 0; i < categories.length; i++) {
      const { slug, name } = categories[i];
      setAllProgress({ current: i + 1, name });
      total += await fetchCategory(slug, name);
    }
    setAllProgress(null);
    toast.success(`All done — fetched ${total} new items across ${categories.length} categories`);
  }

  const label     = "block text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted mb-1.5";
  const statBlock = "rounded-xl border border-inkBorder bg-white p-4";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Bulk 50 Importer</h1>
          <p className="mt-1 text-sm font-sans text-inkMuted">
            Fetch up to 50 Pexels photos per category, auto-generate SEO, then review &amp; approve.
          </p>
        </div>
        <Link
          href="/admin/bulk-50-importer/review"
          className="flex items-center gap-2 rounded-lg bg-terra px-4 py-2.5 text-[13px] font-sans font-medium text-white transition-opacity hover:opacity-90"
        >
          Review &amp; Approve
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className={cn(statBlock, "flex items-center gap-3")}>
          <Clock className="h-5 w-5 text-amber-500 shrink-0" />
          <div>
            <p className={label}>Pending</p>
            <p className="text-xl font-display font-bold text-ink">{stats.pending}</p>
          </div>
        </div>
        <div className={cn(statBlock, "flex items-center gap-3")}>
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <div>
            <p className={label}>Approved</p>
            <p className="text-xl font-display font-bold text-ink">{stats.approved}</p>
          </div>
        </div>
        <div className={cn(statBlock, "flex items-center gap-3")}>
          <XCircle className="h-5 w-5 text-red-400 shrink-0" />
          <div>
            <p className={label}>Rejected</p>
            <p className="text-xl font-display font-bold text-ink">{stats.rejected}</p>
          </div>
        </div>
        <div className={cn(statBlock, "flex items-center gap-3")}>
          <Database className="h-5 w-5 text-indigo-400 shrink-0" />
          <div>
            <p className={label}>History</p>
            <p className="text-xl font-display font-bold text-ink">{stats.historyCount}</p>
          </div>
        </div>
      </div>

      {/* Fetch All button */}
      <div className="rounded-2xl border border-inkBorder bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terra/10">
              <Layers className="h-5 w-5 text-terra" />
            </div>
            <div>
              <p className="font-sans font-semibold text-ink">Fetch 50 For All Categories</p>
              <p className="text-[12px] font-sans text-inkMuted">
                Sequentially fetches {categories.length} categories — up to 50 each
              </p>
            </div>
          </div>

          <button
            onClick={fetchAll}
            disabled={allProgress !== null}
            className="flex items-center gap-2 rounded-lg bg-terra px-5 py-2.5 text-[13px] font-sans font-medium text-white disabled:opacity-60 transition-opacity hover:opacity-90"
          >
            {allProgress ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {allProgress.current}/{categories.length} · {allProgress.name}
              </>
            ) : (
              <>
                <PackagePlus className="h-4 w-4" />
                Fetch 50 For All Categories
              </>
            )}
          </button>
        </div>
      </div>

      {/* Per-category grid */}
      <div>
        <p className={cn(label, "mb-3")}>Or fetch per category</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => {
            const state   = fetchStates[cat.slug] ?? "idle";
            const count   = fetchCounts[cat.slug] ?? null;
            const pending = stats.perCat[cat.slug] ?? 0;

            return (
              <div
                key={cat.slug}
                className="flex flex-col gap-3 rounded-xl border border-inkBorder bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-sans font-semibold text-[13px] text-ink">{cat.name}</p>
                  {pending > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-sans font-medium text-amber-700">
                      {pending} pending
                    </span>
                  )}
                </div>

                {/* Status feedback */}
                {state === "done" && count !== null && (
                  <p className="text-[11px] font-sans text-emerald-600">
                    ✓ Fetched {count} new items
                  </p>
                )}
                {state === "error" && (
                  <p className="text-[11px] font-sans text-red-500">✗ Fetch failed</p>
                )}

                <button
                  onClick={() => fetchCategory(cat.slug, cat.name)}
                  disabled={state === "loading" || allProgress !== null}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-[12px] font-sans font-medium transition-all",
                    state === "done"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-inkBorder bg-stone text-ink hover:border-terra hover:bg-terra/5 hover:text-terra",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching…
                    </>
                  ) : (
                    <>
                      <PackagePlus className="h-3.5 w-3.5" />
                      Fetch 50 {cat.name}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review CTA if there are pending drafts */}
      {stats.pending > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-500" />
              <p className="font-sans font-medium text-amber-800">
                {stats.pending} draft{stats.pending !== 1 ? "s" : ""} waiting for review
              </p>
            </div>
            <Link
              href="/admin/bulk-50-importer/review"
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-[13px] font-sans font-medium text-white transition-opacity hover:opacity-90"
            >
              Review Now <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
