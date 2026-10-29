import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { FurnitureCard } from "@/components/site/FurnitureCard";
import { VideoFurnitureCard } from "@/components/site/VideoFurnitureCard";
import { CategoryFilters } from "@/components/site/CategoryFilters";
import { MobileCategoryBar } from "@/components/site/MobileCategoryBar";
import { CategoryAbout } from "@/components/site/CategoryAbout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getCategoryWithFurniture } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";

type Params = { slug: string };
type Search = { style?: string; wood?: string };

/** First sentence of text, capped at `max` chars at a word boundary. */
function shortLine(text: string, max = 120): string {
  const sentence = text.split(/[.!?](?:\s|$)/)[0].trim();
  if (sentence.length <= max) return sentence;
  const cut = sentence.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const cat = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!cat) return { title: "Collection" };
  const rawCatTitle = cat.metaTitle?.replace(/\s*\|\s*(Chaudhry Furniture House|CH Furniture House)\s*$/i, "").trim();
  const title = rawCatTitle || `${cat.name} in Pakistan`;
  const descFallback = cat.description
    ? `${cat.description.slice(0, 120).trim()} — handcrafted in Sialkot, Pakistan. Custom sizes, finishes and wood types available.`
    : `Browse our ${cat.name} collection — premium handcrafted wooden furniture by CH Furniture House, Sialkot. Custom sizes, finishes and wood types available.`;
  const description = cat.metaDescription || descFallback;
  const url   = `${SITE}/category/${cat.slug}`;
  const image = cat.bannerUrl || cat.thumbUrl || `${SITE}/opengraph-image`;
  return {
    title,
    description,
    keywords: [
      `${cat.name} Sialkot`, `${cat.name} Pakistan`, `wooden ${cat.name}`,
      `custom ${cat.name}`, `handcrafted ${cat.name}`, "CH Furniture House",
      "furniture manufacturer Sialkot", "wooden furniture Pakistan",
    ],
    alternates: { canonical: `${SITE}/category/${cat.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params:       Params;
  searchParams: Search;
}) {
  const [settings, data] = await Promise.all([
    getSettings(),
    getCategoryWithFurniture(params.slug, {
      style:    searchParams.style,
      woodType: searchParams.wood,
    }),
  ]);

  if (!data) notFound();
  const { category, furniture } = data;

  const pageUrl = `${SITE}/category/${category.slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",        item: SITE },
      { "@type": "ListItem", position: 2, name: "Collections", item: `${SITE}/categories` },
      { "@type": "ListItem", position: 3, name: category.name, item: pageUrl },
    ],
  };

  const itemListLd = furniture.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name:          category.name,
    description:   category.description || undefined,
    url:           pageUrl,
    numberOfItems: furniture.length,
    itemListElement: furniture.map((f, i) => ({
      "@type":   "ListItem",
      position:  i + 1,
      url:       `${SITE}/category/${f.categorySlug}/${f.slug}`,
      name:      f.name,
    })),
  } : null;

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />}

      {/* ── Banner / Hero ── */}
      <section className="container-px pt-24 pb-0 md:pt-28">
        {/* Mobile: 150px. Desktop: 450px. */}
        <div className="relative h-[150px] overflow-hidden rounded-3xl md:h-[450px]">
          {category.heroVideoUrl ? (
            <video
              src={category.heroVideoUrl}
              poster={category.heroVideoPosterUrl || undefined}
              autoPlay muted loop playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={category.bannerUrl || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1600&q=80"}
              alt={category.name}
              fill priority
              sizes="100vw"
              className="object-cover"
            />
          )}

          {/* Gradient: bottom-heavy + slight left edge — only behind the text area */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-ink/25 to-transparent" />

          {/* Text: bottom-left. Desktop max-w 600px. Mobile max-w 90%. */}
          <div className="absolute bottom-0 left-0 max-w-[90%] p-6 sm:p-8 md:max-w-[600px] md:p-10">
            <Breadcrumbs
              items={[
                { label: "Home",        href: "/" },
                { label: "Collections", href: "/categories" },
                { label: category.name },
              ]}
              light
            />
            <h1 className="mt-3 font-display text-[30px] font-extrabold leading-tight text-white md:text-[48px]">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-white/80 md:line-clamp-1 md:text-[17px] md:leading-normal">
                {shortLine(category.description)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Filter chips ── */}
      <div className="sticky top-[93px] z-20 md:static container-px border-b border-inkBorder/40 py-3 bg-cream/95 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
        {/* Desktop: existing CategoryFilters */}
        <div className="hidden md:block">
          <Suspense fallback={null}>
            <CategoryFilters />
          </Suspense>
        </div>
        {/* Mobile: compact filter bar */}
        <MobileCategoryBar count={furniture.length} />
      </div>

      {/* ── Product grid ── */}
      <section className="container-px py-10">
        <p className="mb-6 font-sans text-sm text-inkMuted md:block hidden">
          <span className="font-semibold text-ink">{furniture.length}</span> designs
        </p>

        {furniture.length === 0 ? (
          <div className="rounded-2xl border border-inkBorder bg-parchment p-16 text-center">
            <p className="font-display text-2xl font-bold text-ink">
              No designs match these filters yet.
            </p>
            <p className="mt-2 text-inkMuted">
              Try clearing the filters, or message us — we build custom pieces to order.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {furniture.map((f, i) =>
              category.videoMode ? (
                <VideoFurnitureCard key={f.slug} item={f} whatsapp={settings.whatsapp} index={i} />
              ) : (
                <FurnitureCard key={f.slug} item={f} whatsapp={settings.whatsapp} index={i} />
              )
            )}
          </div>
        )}
      </section>

      {/* ── About section (full description, below grid) ── */}
      {(category.seoText || category.description) && (
        <CategoryAbout
          name={category.name}
          description={category.description ?? ""}
          seoText={category.seoText ?? undefined}
        />
      )}
    </SiteShell>
  );
}
