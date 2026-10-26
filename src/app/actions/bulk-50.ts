"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
}

export type ApproveItem = {
  draftId: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

export async function approveDrafts(
  items: ApproveItem[]
): Promise<{ approved: number; skipped: number }> {
  await requireAdmin();
  let approved = 0;
  let skipped = 0;

  for (const item of items) {
    const { data: draft } = await supabase
      .from("bulk_50_drafts")
      .select("*")
      .eq("id", item.draftId)
      .single();

    if (!draft) { skipped++; continue; }

    const d = draft as unknown as Record<string, any>;
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", d.category)
      .single();

    if (!cat) { skipped++; continue; }

    const catRow = cat as unknown as Record<string, any>;
    const slug = item.seoTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);

    await supabase.from("products").insert({
      name: item.seoTitle.split("|")[0].trim(),
      slug,
      category_id: catRow.id,
      meta_title: item.seoTitle,
      meta_description: item.seoDescription,
      features: item.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean),
      images: [{ url: d.image_url_4k, is_primary: true, sort_order: 0, alt: item.seoTitle }],
      is_active: true,
      sort_order: 0,
    });

    await supabase
      .from("bulk_50_drafts")
      .update({ status: "approved" })
      .eq("id", item.draftId);

    approved++;
  }

  return { approved, skipped };
}

export async function rejectDrafts(ids: string[]): Promise<void> {
  await requireAdmin();
  await supabase
    .from("bulk_50_drafts")
    .update({ status: "rejected" })
    .in("id", ids);
}

export async function clearRejectedDrafts(): Promise<void> {
  await requireAdmin();
  await supabase
    .from("bulk_50_drafts")
    .delete()
    .eq("status", "rejected");
}
