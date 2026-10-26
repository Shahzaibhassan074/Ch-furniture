"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Star, EyeOff } from "lucide-react";
import { upsertTestimonial, deleteTestimonial } from "@/app/actions/admin";

type Testimonial = {
  id: string;
  author: string;
  role: string | null;
  quote: string;
  rating: number;
  published: boolean;
  sortOrder: number;
};

const field =
  "w-full rounded-lg border border-inkBorder bg-white px-4 py-2.5 text-ink placeholder:text-inkMuted/60 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra/20 transition-colors";
const label = "block text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted mb-1.5";

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const showForm = creating || editing !== null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-inkMuted">Reviews</p>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">Testimonials</h1>
          <p className="mt-1 text-sm text-inkMuted">{testimonials.length} testimonials</p>
        </div>
        {!showForm && (
          <button onClick={() => setCreating(true)} className="btn-terra">
            <Plus className="h-4 w-4" /> Add
          </button>
        )}
      </div>

      {showForm ? (
        <Form testimonial={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      ) : (
        <div className="mt-8 space-y-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex items-start gap-4 rounded-xl border border-inkBorder bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink">{t.author}</p>
                  {!t.published && <EyeOff className="h-3.5 w-3.5 text-inkMuted" />}
                  <span className="flex text-terra">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-terra" />
                    ))}
                  </span>
                </div>
                {t.role && <p className="text-xs text-inkMuted">{t.role}</p>}
                <p className="mt-1 line-clamp-2 text-sm text-inkMuted">{t.quote}</p>
              </div>
              <button
                onClick={() => setEditing(t)}
                className="rounded-lg border border-inkBorder px-3 py-2 text-xs text-inkMuted transition-colors hover:border-terra/40 hover:text-terra"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <DeleteBtn id={t.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Form({ testimonial, onClose }: { testimonial: Testimonial | null; onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  async function action(formData: FormData) {
    setSaving(true);
    try {
      await upsertTestimonial(testimonial?.id ?? null, formData);
      toast.success(testimonial ? "Updated" : "Created");
      onClose();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="mt-8 rounded-xl border border-inkBorder bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-ink">
          {testimonial ? "Edit" : "New"} Testimonial
        </h2>
        <button onClick={onClose} className="rounded-lg p-1 text-inkMuted transition-colors hover:text-ink">
          <X className="h-5 w-5" />
        </button>
      </div>
      <form action={action} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Author</label>
            <input name="author" defaultValue={testimonial?.author} required className={field} />
          </div>
          <div>
            <label className={label}>Role / location</label>
            <input
              name="role"
              defaultValue={testimonial?.role ?? ""}
              placeholder="e.g. Homeowner, Lahore"
              className={field}
            />
          </div>
        </div>
        <div>
          <label className={label}>Quote</label>
          <textarea name="quote" defaultValue={testimonial?.quote} required rows={3} className={field} />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={label}>Rating (1–5)</label>
            <input
              name="rating"
              type="number"
              min={1}
              max={5}
              defaultValue={testimonial?.rating ?? 5}
              className={field}
            />
          </div>
          <div>
            <label className={label}>Sort order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={testimonial?.sortOrder ?? 0}
              className={field}
            />
          </div>
          <label className="flex items-center gap-2 pt-7 text-sm text-ink">
            <input
              name="published"
              type="checkbox"
              defaultChecked={testimonial?.published ?? true}
              className="h-4 w-4 accent-terra"
            />
            Published
          </label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-terra disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteBtn({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false);
  return confirm ? (
    <button
      onClick={async () => {
        try {
          await deleteTestimonial(id);
          toast.success("Deleted");
        } catch {
          toast.error("Delete failed");
        }
      }}
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
    >
      Confirm?
    </button>
  ) : (
    <button
      onClick={() => setConfirm(true)}
      className="rounded-lg border border-inkBorder px-3 py-2 text-inkMuted transition-colors hover:border-red-200 hover:text-red-500"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
