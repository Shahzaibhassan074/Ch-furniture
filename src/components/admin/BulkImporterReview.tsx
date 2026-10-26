"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  Loader2, Trash2, SquareCheck, Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { approveDrafts, rejectDrafts, clearRejectedDrafts, type ApproveItem } from "@/app/actions/bulk-50";

type Draft = {
  id:             string;
  photoId:        string;
  category:       string;
  imageUrl4k:     string;
  seoTitle:       string;
  seoDescription: string;
  seoKeywords:    string;
  status:         string;
  createdAt:      Date;
};

type DraftEdit = {
  seoTitle:       string;
  seoDescription: string;
  seoKeywords:    string;
};

type Category = { slug: string; name: string };

type Stats = { pending: number; approved: number; rejected: number };

export function BulkImporterReview({
  drafts:    initialDrafts,
  total,
  page,
  perPage,
  categories,
  activeStatus,
  activeCategory,
  stats,
}: {
  drafts:         Draft[];
  total:          number;
  page:           number;
  perPage:        number;
  categories:     Category[];
  activeStatus:   string;
  activeCategory: string;
  stats:          Stats;
}) {
  const router = useRouter();

  const [edits,    setEdits]    = useState<Record<string, DraftEdit>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading,  setLoading]  = useState(false);

  const totalPages = Math.ceil(total / perPage);

  const getEdit = (draft: Draft): DraftEdit => ({
    seoTitle:       edits[draft.id]?.seoTitle       ?? draft.seoTitle,
    seoDescription: edits[draft.id]?.seoDescription ?? draft.seoDescription,
    seoKeywords:    edits[draft.id]?.seoKeywords     ?? draft.seoKeywords,
  });

  const updateEdit = useCallback(
    (id: string, field: keyof DraftEdit, value: string) => {
      setEdits((e) => ({ ...e, [id]: { ...e[id], [field]: value } }));
    },
    [],
  );

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === initialDrafts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(initialDrafts.map((d) => d.id)));
    }
  };

  const navUrl = (params: Record<string, string>) => {
    const p = new URLSearchParams({
      status:   activeStatus,
      category: activeCategory,
      page:     String(page),
      ...params,
    });
    return `/admin/bulk-50-importer/review?${p}`;
  };

  async function handleApprove() {
    if (!selected.size) { toast.error("Select at least one item"); return; }
    setLoading(true);
    try {
      const items: ApproveItem[] = [...selected].map((id) => {
        const d = initialDrafts.find((x) => x.id === id)!;
        const e = getEdit(d);
        return { draftId: id, ...e };
      });
      const result = await approveDrafts(items);
      toast.success(`Approved ${result.approved} items${result.skipped ? ` (${result.skipped} skipped — category not found)` : ""}`);
      setSelected(new Set());
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Approve failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!selected.size) { toast.error("Select at least one item"); return; }
    setLoading(true);
    try {
      await rejectDrafts([...selected]);
      toast.success(`Rejected ${selected.size} items`);
      setSelected(new Set());
      router.refresh();
    } catch {
      toast.error("Reject failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleClearRejected() {
    if (!confirm("Delete all rejected drafts permanently?")) return;
    setLoading(true);
    try {
      await clearRejectedDrafts();
      toast.success("Rejected drafts cleared");
      router.refresh();
    } catch {
      toast.error("Clear failed");
    } finally {
      setLoading(false);
    }
  }

  const label  = "block text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted mb-1";
  const input  = "w-full rounded-lg border border-inkBorder bg-stone px-3 py-1.5 text-[12px] font-sans text-ink focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra/30";
  const STATUS_TABS = ["all", "pending", "approved", "rejected"] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/bulk-50-importer"
            className="flex items-center gap-1.5 text-[13px] font-sans text-inkMuted hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <div className="h-4 w-px bg-inkBorder" />
          <h1 className="font-display text-2xl font-bold text-ink">Review Drafts</h1>
        </div>
        <div className="flex items-center gap-2">
          {stats.rejected > 0 && (
            <button
              onClick={handleClearRejected}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-[12px] font-sans text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear {stats.rejected} rejected
            </button>
          )}
        </div>
      </div>

      {/* Stats pills */}
      <div className="flex flex-wrap gap-2 text-[12px] font-sans">
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
          {stats.pending} pending
        </span>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
          {stats.approved} approved
        </span>
        <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-500">
          {stats.rejected} rejected
        </span>
      </div>

      {/* Status + category filters */}
      <div className="flex flex-wrap gap-3">
        {/* Status tabs */}
        <div className="flex rounded-lg border border-inkBorder bg-white overflow-hidden">
          {STATUS_TABS.map((s) => (
            <Link
              key={s}
              href={navUrl({ status: s, page: "1" })}
              className={cn(
                "px-4 py-2 text-[12px] font-sans font-medium capitalize transition-colors",
                activeStatus === s
                  ? "bg-terra text-white"
                  : "text-inkMuted hover:bg-stone hover:text-ink",
              )}
            >
              {s}
            </Link>
          ))}
        </div>

        {/* Category filter */}
        <select
          defaultValue={activeCategory}
          onChange={(e) => router.push(navUrl({ category: e.target.value, page: "1" }))}
          className="rounded-lg border border-inkBorder bg-white px-3 py-2 text-[12px] font-sans text-ink focus:outline-none focus:ring-1 focus:ring-terra/30"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Bulk actions bar */}
      {initialDrafts.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-inkBorder bg-white p-3">
          <button
            onClick={toggleAll}
            className="flex items-center gap-1.5 text-[12px] font-sans text-inkMuted transition-colors hover:text-ink"
          >
            {selected.size === initialDrafts.length
              ? <SquareCheck className="h-4 w-4 text-terra" />
              : <Square className="h-4 w-4" />}
            {selected.size === initialDrafts.length ? "Deselect all" : "Select all"}
          </button>

          {selected.size > 0 && (
            <>
              <span className="text-[12px] font-sans text-inkMuted">
                {selected.size} selected
              </span>
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-[12px] font-sans font-medium text-white disabled:opacity-60 transition-opacity hover:opacity-90"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  Approve {selected.size}
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-[12px] font-sans font-medium text-red-600 disabled:opacity-60 transition-opacity hover:opacity-90"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                  Reject {selected.size}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Draft grid */}
      {initialDrafts.length === 0 ? (
        <div className="rounded-2xl border border-inkBorder bg-white py-20 text-center">
          <p className="font-sans text-inkMuted">No drafts found for this filter.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {initialDrafts.map((draft) => {
            const edit = getEdit(draft);
            const isSelected = selected.has(draft.id);
            return (
              <div
                key={draft.id}
                className={cn(
                  "group relative flex flex-col rounded-2xl border bg-white overflow-hidden transition-shadow hover:shadow-md",
                  isSelected ? "border-terra shadow-sm" : "border-inkBorder",
                )}
              >
                {/* Checkbox overlay */}
                <button
                  onClick={() => toggleSelect(draft.id)}
                  className="absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm transition-transform hover:scale-110"
                >
                  {isSelected
                    ? <SquareCheck className="h-4 w-4 text-terra" />
                    : <Square className="h-4 w-4 text-inkMuted" />}
                </button>

                {/* Category badge */}
                <span className="absolute top-3 right-3 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-sans font-medium text-inkMuted shadow backdrop-blur-sm">
                  {draft.category}
                </span>

                {/* Status badge */}
                <span className={cn(
                  "absolute bottom-3 right-3 z-10 rounded-full px-2 py-0.5 text-[10px] font-sans font-medium shadow",
                  draft.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                  draft.status === "rejected" ? "bg-red-100 text-red-600" :
                  "bg-amber-100 text-amber-700",
                )}>
                  {draft.status}
                </span>

                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.imageUrl4k}
                  alt={edit.seoTitle}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />

                {/* Editable fields */}
                <div className="flex flex-col gap-3 p-4">
                  <div>
                    <label className={label}>Title</label>
                    <input
                      value={edit.seoTitle}
                      onChange={(e) => updateEdit(draft.id, "seoTitle", e.target.value)}
                      className={input}
                    />
                  </div>
                  <div>
                    <label className={label}>Description</label>
                    <textarea
                      value={edit.seoDescription}
                      onChange={(e) => updateEdit(draft.id, "seoDescription", e.target.value)}
                      rows={3}
                      className={cn(input, "resize-none")}
                    />
                  </div>
                  <div>
                    <label className={label}>Keywords</label>
                    <textarea
                      value={edit.seoKeywords}
                      onChange={(e) => updateEdit(draft.id, "seoKeywords", e.target.value)}
                      rows={2}
                      className={cn(input, "resize-none text-[11px] text-inkMuted")}
                    />
                  </div>

                  {/* Individual actions — only shown for pending */}
                  {draft.status === "pending" && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={async () => {
                          setLoading(true);
                          try {
                            const result = await approveDrafts([{ draftId: draft.id, ...edit }]);
                            toast.success(`Approved "${edit.seoTitle.split("|")[0].trim()}"`);
                            if (result.skipped > 0) toast.warning("Category not found in DB — item skipped");
                            router.refresh();
                          } catch { toast.error("Approve failed"); }
                          finally { setLoading(false); }
                        }}
                        disabled={loading}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 py-1.5 text-[12px] font-sans font-medium text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={async () => {
                          setLoading(true);
                          try {
                            await rejectDrafts([draft.id]);
                            toast.success("Rejected");
                            router.refresh();
                          } catch { toast.error("Reject failed"); }
                          finally { setLoading(false); }
                        }}
                        disabled={loading}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 py-1.5 text-[12px] font-sans font-medium text-red-600 disabled:opacity-60 hover:opacity-90 transition-opacity"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-inkBorder pt-5">
          <p className="text-[12px] font-sans text-inkMuted">
            Page {page} of {totalPages} · {total} total
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={navUrl({ page: String(page - 1) })}
                className="flex items-center gap-1.5 rounded-lg border border-inkBorder px-3 py-2 text-[12px] font-sans text-inkMuted hover:bg-stone transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={navUrl({ page: String(page + 1) })}
                className="flex items-center gap-1.5 rounded-lg border border-inkBorder px-3 py-2 text-[12px] font-sans text-inkMuted hover:bg-stone transition-colors"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
