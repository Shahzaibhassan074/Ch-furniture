import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { CategoryCard } from "@/components/site/CategoryCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { MobileCategoriesLayout } from "@/components/site/MobileCategoriesLayout";
import { getAllCategories } from "@/lib/queries";

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";

export const metadata: Metadata = {
  title: "All Furniture Collections",
  description:
    "Browse all furniture collections by CH Furniture House — sofas, beds, dining sets, chairs, wardrobes, TV units, carved pieces and custom furniture made in Sialkot, Pakistan.",
  keywords: [
    "wooden furniture collections Sialkot",
    "custom furniture Pakistan",
    "handcrafted furniture categories",
    "buy furniture Sialkot",
    "sofa set Pakistan",
    "bedroom furniture Sialkot",
    "dining table Pakistan",
    "wooden wardrobe Pakistan",
    "carved furniture Sialkot",
  ],
  alternates: { canonical: `${SITE}/categories` },
  openGraph: {
    title: "All Furniture Collections | CH Furniture House",
    description:
      "Sofas, beds, dining sets, chairs, wardrobes, TV units, carved furniture and custom pieces — all handcrafted in Sialkot, Pakistan.",
    url: `${SITE}/categories`,
    type: "website",
    images: [{ url: `${SITE}/opengraph-image`, width: 1200, height: 630, alt: "CH Furniture House Collections" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Furniture Collections | CH Furniture House",
    description: "Browse handcrafted furniture collections from Sialkot, Pakistan.",
    images: [`${SITE}/opengraph-image`],
  },
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Furniture Collections — CH Furniture House",
    description:
      "Browse all furniture collections by CH Furniture House — sofas, beds, dining sets, chairs, wardrobes, TV units, carved pieces and custom furniture made in Sialkot, Pakistan.",
    url: `${SITE}/categories`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Collections", item: `${SITE}/categories` },
      ],
    },
    hasPart: categories.map((c) => ({
      "@type": "ItemList",
      name: c.name,
      url: `${SITE}/category/${c.slug}`,
      numberOfItems: c.count ?? 0,
    })),
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      {/* Header */}
      <div className="container-px pt-28 pb-10 md:pt-32">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections" }]} />
        <Reveal>
          <p className="eyebrow mt-8">The Catalogue</p>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-tight text-ink">
            {categories.length} collections,{" "}
            <span className="text-terra">
              {categories.reduce((s, c) => s + (c.count ?? 0), 0)} pieces
            </span>{" "}
            handcrafted.
          </h1>
          <p className="mt-4 max-w-xl text-base text-inkMuted">
            Every category is fully customizable — explore the designs, then message us to tailor
            any piece to your space, dimensions and finish.
          </p>
        </Reveal>
      </div>

      {/* Mobile Danube layout */}
      <div className="md:hidden">
        <Suspense fallback={<div className="h-[calc(100vh-120px)] bg-cream" />}>
          <MobileCategoriesLayout categories={categories} />
        </Suspense>
      </div>

      {/* Desktop grid — UNCHANGED */}
      <div className="hidden md:block container-px pb-28">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
