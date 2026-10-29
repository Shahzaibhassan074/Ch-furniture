import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, MessageCircle, ArrowRight, ArrowLeft, Phone } from "lucide-react";
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
    ...(item.startingPrice
      ? {
          offers: {
            "@type":       "Offer",
            "@id":         `${productUrl}#offer`,
            availability:  "https://schema.org/InStock",
            price:         item.startingPrice.toString(),
            priceCurrency: "PKR",
            seller: {
              "@type": "Organization",
              "@id":   `${SITE}/#business`,
              name:    "CH Furniture House",
            },
          },
        }
      : {}),
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
    { label: "Style",          value: item.style },
    { label: "Wood Type",      value: item.woodType },
    { label: "Finish",         value: item.finish },
    { label: "Dimensions",     value: item.dimensions },
    { label: "Sizes",          value: item.sizes },
    { label: "Finish Options", value: item.finishOptions },
    { label: "Delivery Time",  value: item.deliveryTime },
  ].filter((s) => s.value);

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* ═══════════════════════════════════════════════════
          MOBILE PRODUCT LAYOUT
          ═══════════════════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Full-bleed gallery */}
        <div className="relative w-full overflow-hidden">
          <ProductGallery media={media} name={item.name} compact />

          {/* Floating back button */}
          <div className="absolute top-[72px] left-4 z-10">
            <Link
              href={`/category/${item.category.slug}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>

          {/* Floating share button */}
          <div className="absolute top-[72px] right-4 z-10">
            <ShareButton title={item.name} />
          </div>
        </div>

        {/* Content card overlapping gallery */}
        <div className="-mt-[22px] relative z-10 rounded-t-[24px] bg-cream">
          <div className="px-5 pt-7 pb-40">
            {/* Style badge */}
            {item.style && (
              <span className="badge-blush mb-3 inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-terra" />
                {item.style}
              </span>
            )}

            {/* Product name */}
            <h1 className="font-display text-[28px] font-extrabold leading-tight text-ink">
              {item.name}
            </h1>
            {item.shortDesc && (
              <p className="mt-2 text-[15px] leading-relaxed text-inkMuted">{item.shortDesc}</p>
            )}
            {item.startingPrice && (
              <p className="mt-3 font-sans text-sm text-inkMuted">
                Starting from{" "}
                <span className="font-semibold text-ink">
                  PKR {item.startingPrice.toLocaleString()}
                </span>
              </p>
            )}
            {item.description ? (
              <p className="mt-4 text-[15px] leading-relaxed text-inkMuted">{item.description}</p>
            ) : !item.shortDesc && (
              <p className="mt-4 text-[15px] leading-relaxed text-inkMuted">
                The {item.name} is a premium handcrafted{" "}
                {item.category.name.toLowerCase()} by CH Furniture House, built from{" "}
                {item.woodType ? item.woodType : "solid wood"} in our Sialkot workshop.
                Available in custom sizes, finishes, and wood types —
                contact us on WhatsApp for pricing and lead times.
              </p>
            )}

            {/* Specs card */}
            {specs.length > 0 && (
              <div className="mt-6 rounded-2xl border border-inkBorder bg-parchment overflow-hidden">
                <table className="w-full text-[13px]">
                  <tbody>
                    {specs.map((s, i) => (
                      <tr key={s.label} className={i !== specs.length - 1 ? "border-b border-inkBorder" : ""}>
                        <td className="py-3 pl-4 pr-3 font-sans text-[10px] font-medium uppercase tracking-widest2 text-inkMuted w-[38%]">
                          {s.label}
                        </td>
                        <td className="py-3 pr-4 font-sans font-medium text-ink">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <ul className="mt-5 space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-inkMuted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-terra" />
                    <span className="text-[14px]">{f}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                { icon: "🚚", text: "Free delivery in Pakistan" },
                { icon: "🪵", text: "Solid wood guarantee" },
                { icon: "💳", text: "Easy monthly installments" },
              ].map((badge) => (
                <div key={badge.text} className="rounded-xl border border-inkBorder bg-parchment p-3 text-center">
                  <div className="text-xl mb-1">{badge.icon}</div>
                  <p className="text-[11px] font-sans text-inkMuted leading-tight">{badge.text}</p>
                </div>
              ))}
            </div>

            {/* Custom size note */}
            <div className="mt-5 rounded-2xl bg-blush/30 border border-blush px-4 py-3">
              <p className="text-[13px] font-sans text-terra">
                Need a different size? We build every piece to custom dimensions — just mention it on WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile sticky bottom bar */}
        <div
          className="fixed inset-x-0 bottom-0 z-[60] bg-cream/95 backdrop-blur-sm border-t border-inkBorder"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex gap-3 px-4 py-3">
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl border border-inkBorder bg-parchment text-ink"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href={whatsappUrl(settings.whatsapp, waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-terra flex-1 h-[54px] text-[15px] justify-center"
            >
              <MessageCircle className="h-5 w-5" /> Enquire on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          DESKTOP PRODUCT LAYOUT — UNCHANGED
          ═══════════════════════════════════════════════════ */}
      <div className="hidden md:block">
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
              {item.startingPrice && (
                <p className="mt-4 font-sans text-sm text-inkMuted">
                  Starting from{" "}
                  <span className="font-semibold text-ink">
                    PKR {item.startingPrice.toLocaleString()}
                  </span>
                </p>
              )}
              {item.description ? (
                <p className="mt-4 leading-relaxed text-inkMuted">{item.description}</p>
              ) : !item.shortDesc && (
                <p className="mt-4 leading-relaxed text-inkMuted">
                  The {item.name} is a premium handcrafted{" "}
                  {item.category.name.toLowerCase()} by CH Furniture House, built from{" "}
                  {item.woodType ? item.woodType : "solid wood"} in our Sialkot workshop.
                  Available in custom sizes, finishes, and wood types —
                  contact us on WhatsApp for pricing and lead times.
                </p>
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
      </div>

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
