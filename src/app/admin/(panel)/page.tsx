import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Boxes, Sofa, MessageSquareQuote, Mail, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const getDashboardCounts = unstable_cache(
  async () => {
    const [categories, furniture, testimonials] = await Promise.all([
      prisma.category.count(),
      prisma.furniture.count(),
      prisma.testimonial.count(),
    ]);
    return { categories, furniture, testimonials };
  },
  ["admin-dashboard-counts"],
  { tags: ["categories", "furniture", "testimonials"] }
);

export default async function Dashboard() {
  const [counts, unread] = await Promise.all([
    getDashboardCounts(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const stats = [
    { label: "Categories", value: counts.categories, href: "/admin/categories", icon: Boxes, desc: "Browse folders" },
    { label: "Furniture", value: counts.furniture, href: "/admin/furniture", icon: Sofa, desc: "All designs" },
    { label: "Testimonials", value: counts.testimonials, href: "/admin/testimonials", icon: MessageSquareQuote, desc: "Customer reviews" },
    { label: "Unread Messages", value: unread, href: "/admin/messages", icon: Mail, desc: "New enquiries", highlight: unread > 0 },
  ];

  return (
    <div>
      <div>
        <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-inkMuted">
          Overview
        </p>
        <h1 className="mt-1 font-display text-4xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-inkMuted">Manage your catalog, content and enquiries.</p>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              s.highlight ? "border-terra/40" : "border-inkBorder"
            }`}
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
              s.highlight ? "bg-terra/10" : "bg-stone"
            }`}>
              <s.icon className={`h-5 w-5 ${s.highlight ? "text-terra" : "text-inkMuted"}`} />
            </div>
            <p className="mt-4 font-display text-4xl font-bold text-ink">{s.value}</p>
            <p className="mt-0.5 text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted">
              {s.label}
            </p>
            <p className="mt-1 text-xs text-inkMuted/70">{s.desc}</p>
            <ArrowRight className="absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-inkBorder transition-transform group-hover:translate-x-0.5 group-hover:text-terra" />
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8 rounded-xl border border-inkBorder bg-white p-6 shadow-sm">
        <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-inkMuted">
          Quick actions
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/categories" className="btn-terra">
            Browse Categories
          </Link>
          <Link href="/admin/messages" className="btn-ghost">
            View Messages
          </Link>
        </div>
      </div>
    </div>
  );
}
