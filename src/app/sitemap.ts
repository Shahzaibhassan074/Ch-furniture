import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/queries";

// Always read from the database — never serve a build-time cached sitemap.
export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";

const staticPriorities: Record<string, number> = {
  "":            1.0,
  "/categories": 0.9,
  "/contact":    0.8,
  "/about":      0.7,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/about", "/categories", "/contact"].map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: p === "" || p === "/categories" ? ("daily" as const) : ("weekly" as const),
    priority: staticPriorities[p] ?? 0.7,
  }));
  // Race the DB call against a 6-second timeout so Google always gets a valid XML response
  const fallback = { cats: [] as any[], items: [] as any[] };
  const timeoutPromise = new Promise<typeof fallback>((resolve) =>
    setTimeout(() => resolve(fallback), 6000)
  );

  const { cats, items } = await Promise.race([
    getAllSlugs().catch(() => fallback),
    timeoutPromise,
  ]);

  const categoryRoutes = cats.map((c: any) => ({
    url: `${SITE}/category/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes = items.map((i: any) => ({
    url: `${SITE}/category/${i.category.slug}/${i.slug}`,
    lastModified: i.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
