import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, MessageCircle, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductGallery } from "@/components/site/ProductGallery";
import { ShareButton } from "@/components/site/ShareButton";
import { FurnitureCard } from "@/components/site/FurnitureCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/home/Sections";
import { Reveal } from "@/components/motion/Reveal";
import { getFurnitureBySlug, getRelated } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { parseList, whatsappUrl } from "@/lib/utils";

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";

type Params = { slug: string; product: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const item = await getFurnitureBySlug(params.product);
  if (!item || !item.category) return { title: "Design" };
  const img   = item.images.find((i) => i.isPrimary)?.url ?? item.images[0]?.url;
  // Strip any trailing brand suffix from metaTitle so the root template doesn't double-brand it
  const rawTitle = item.metaTitle?.replace(/\s*\|\s*(Chaudhry Furniture House|CH Furniture House)\s*$/i, "").trim();
  const title = rawTitle || item.name;
  const description =
    item.metaDescription ||
    item.shortDesc ||
    item.description?.slice(0, 160) ||
    `${item.name} — handcrafted wooden furniture by CH Furniture House, Sialkot, Pakistan.`;
  const url = `${SITE}/category/${item.category.slug}/${item.slug}`;
  const keywords = [
    item.name, item.category.name,
    ...(item.style    ? [`${item.style} furniture`]    : []),
    ...(item.woodType ? [`${item.woodType} wood`]      : []),
    "handcrafted furniture Sialkot", "custom wooden furniture Pakistan",
    "CH Furniture House", "wooden furniture manufacturer",
  ];
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, type: "website",
      images: img ? [{ url: img, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: img ? [img] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const item = await getFurnitureBySlug(params.product);
  if (!item || !item.published || !item.category) notFound();

  const [settings, related] = await Promise.all([
    getSettings(),
    getRelated(item.categoryId, item.id, 4),
  ]);

  const features = Array.isArray(item.features) ? item.features : parseList(item.features as unknown as string);
  const media = [
    ...item.images.map((i) => ({ type: "image" as const, url: i.url, alt: i.alt ?? `${item.name} by CH Furniture House` })),
    ...item.videos.map((v) => ({ type: "video" as const, url: v.url, poster: v.posterUrl ?? undefined })),
  ];

  const waMessage = `Hello CH Furniture House,\nI'm interested in the ${item.name}. Please send pricing, available wood options, delivery information and customization options.`;
  const productUrl = `${SITE}/category/${item.category.slug}/${item.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name:        item.name,
    description: item.shortDesc || item.description || undefined,
    url:         productUrl,
    sku:         item.slug,
    category:    item.category.name,
    material:    item.woodType || undefined,
    color:       item.finish   || undefined,
    brand:       { "@type": "Brand", name: "CH Furniture House" },
    image:       item.images.map((i) => i.url),
    manufacturer: {
      "@type": "Organization",
      "@id":   `${SITE}/#business`,
      name:    "CH Furniture House",
      url:     SITE,
    },
    offers: {
      "@type":        "Offer",
      "@id":          `${productUrl}#offer`,
      availability:   "https://schema.org/InStock",
      priceCurrency:  "PKR",
      priceSpecification: {
        "@type":          "PriceSpecification",
        priceCurrency:    "PKR",
        description:      "Custom pricing — contact for quote",
      },
      seller: {
        "@type": "Organization",
        "@id":   `${SITE}/#business`,
        name:    "CH Furniture House",
      },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",           item: SITE },
      { "@type": "ListItem", position: 2, name: "Collections",    item: `${SITE}/categories` },
      { "@type": "ListItem", position: 3, name: item.category.name, item: `${SITE}/category/${item.category.slug}` },
      { "@type": "ListItem", position: 4, name: item.name,        item: productUrl },
    ],
  };

  const specs = [
    { label: "Style",      value: item.style },
    { label: "Wood Type",  value: item.woodType },
    { label: "Finish",     value: item.finish },
    { label: "Dimensions", value: item.dimensions },
  ].filter((s) => s.value);

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumb */}
      <div className="container-px pt-24 pb-4 md:pt-28">
        <Breadcrumbs
          items={[
            { label: "Home",              href: "/" },
            { label: "Collections",       href: "/categories" },
            { label: item.category.name,  href: `/category/${item.category.slug}` },
            { label: item.name },
          ]}
        />
      </div>

      {/* Product layout */}
      <section className="container-px grid gap-12 pb-20 lg:grid-cols-2 lg:gap-16">
        <Reveal><ProductGallery media={media} name={item.name} /></Reveal>

        <Reveal delay={0.08}>
          <div>
            {/* Style tag */}
            {item.style && (
              <span className="badge-blush mb-3 inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-terra" />
                {item.style}
              </span>
            )}

            <h1 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold leading-tight text-ink">
              {item.name}
            </h1>

            {item.shortDesc && (
              <p className="mt-3 text-lg leading-relaxed text-inkMuted">{item.shortDesc}</p>
            )}
            {item.description && (
              <p className="mt-4 leading-relaxed text-inkMuted">{item.description}</p>
            )}

            {/* Specs */}
            {specs.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-inkBorder bg-inkBorder">
                {specs.map((s) => (
                  <div key={s.label} className="bg-parchment p-4">
                    <dt className="text-[10px] font-sans font-medium uppercase tracking-widest2 text-inkMuted">
                      {s.label}
                    </dt>
                    <dd className="mt-1 font-sans font-medium text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Features */}
            {features.length > 0 && (
              <ul className="mt-7 space-y-2.5">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-inkMuted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-terra" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Actions */}
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={whatsappUrl(settings.whatsapp, waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terra"
              >
                <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
              </a>
              <ShareButton title={item.name} />
            </div>

            {/* Back to category */}
            <Link
              href={`/category/${item.category.slug}`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-sans text-inkMuted hover:text-terra"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              Back to {item.category.name}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Related pieces */}
      {related.length > 0 && (
        <section className="bg-stone py-20">
          <div className="container-px">
            <Reveal>
              <SectionHeading
                eyebrow="You may also like"
                title="Related designs."
                accentWord="designs."
              />
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((f, i) => (
                <FurnitureCard key={f.slug} item={f} whatsapp={settings.whatsapp} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
