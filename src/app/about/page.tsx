import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Stats, Process, CTA } from "@/components/site/home/Sections";
import { Reveal } from "@/components/motion/Reveal";
import { getSettings } from "@/lib/settings";
import { withRetry } from "@/lib/prisma";

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";

export const metadata: Metadata = {
  title: "Our Story & Sialkot Workshop",
  description:
    "The story, craftsmanship and workshop behind CH Furniture House — premium wooden furniture handmade in Sialkot, Pakistan. Three generations of woodworking heritage.",
  keywords: [
    "CH Furniture House story",
    "furniture manufacturer Sialkot history",
    "wooden furniture craftsmanship Pakistan",
    "handmade furniture Sialkot",
    "Pakistani furniture brand",
    "CH Abid Hassan furniture founder",
  ],
  alternates: { canonical: `${SITE}/about` },
  openGraph: {
    title: "About CH Furniture House | Premium Wooden Furniture Sialkot",
    description:
      "The story, craftsmanship and workshop behind CH Furniture House — premium wooden furniture handmade in Sialkot, Pakistan. Three generations of woodworking heritage.",
    url: `${SITE}/about`,
    type: "website",
    images: [{ url: `${SITE}/opengraph-image`, width: 1200, height: 630, alt: "CH Furniture House Workshop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About CH Furniture House",
    description: "Three generations of premium wooden furniture craftsmanship in Sialkot, Pakistan.",
    images: [`${SITE}/opengraph-image`],
  },
};

export default async function AboutPage() {
  const s = await withRetry(() => getSettings());

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}/#business`,
    name: "Chaudhry Furniture House",
    url: SITE,
    logo: { "@type": "ImageObject", url: `${SITE}/icon`, width: 32, height: 32 },
    image: `${SITE}/opengraph-image`,
    foundingDate: "1989",
    founder: { "@type": "Person", name: "CH. Abid Hassan" },
    description: s.aboutStory || "Chaudhry Furniture House began in a small Sialkot workshop with a simple belief: furniture should be built to outlive trends.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mohala Sardaaran, Near HBL Bank, Kalaswala",
      addressLocality: "Pasrur",
      addressRegion: "Sialkot, Punjab",
      addressCountry: "PK",
    },
    numberOfEmployees: { "@type": "QuantitativeValue", value: s.craftsmenCount },
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      {/* Header */}
      <div className="container-px pt-28 pb-10 md:pt-32">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <Reveal>
          <p className="eyebrow mt-8">Our Story</p>
          <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-tight text-ink">
            Three generations of wood,{" "}
            <span className="text-terra">joined by hand.</span>
          </h1>
        </Reveal>
      </div>

      {/* Founder + story */}
      <section className="container-px grid gap-12 pb-20 lg:grid-cols-2 lg:gap-16 lg:items-center">

        {/* ── Founder photo card ── */}
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            {/* Founder photo — set via Admin → Settings → "Founder photo" */}
            {s.founderImageUrl ? (
              <Image
                src={s.founderImageUrl}
                alt="CH. Abid Hassan — Founder, Chaudhry Furniture House"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover object-top"
                priority
              />
            ) : (
              <>
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(145deg, #EDE4D6 0%, #D4BFA0 45%, #B8924F 100%)" }}
                />
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: "radial-gradient(circle at 30% 20%, #fff 0%, transparent 60%)" }} />
              </>
            )}

            {/* Founder & owner badge */}
            <div className="absolute bottom-5 left-5 flex items-center gap-1.5 rounded-full bg-terra px-4 py-2 text-xs font-sans font-semibold text-white shadow-lg">
              <BadgeCheck className="h-3.5 w-3.5 shrink-0" />
              Founder &amp; owner
            </div>
          </div>
        </Reveal>

        {/* ── Founder info + story ── */}
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-5">

            {/* Eyebrow */}
            <p className="eyebrow">CH Furniture House</p>

            {/* Heading */}
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight text-ink">
              The man behind{" "}
              <span className="text-terra">the brand.</span>
            </h2>

            {/* Thin rule */}
            <div className="h-px w-12 rounded-full bg-inkBorder" />

            {/* Name + role */}
            <div>
              <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight text-ink">
                CH. Abid Hassan
              </p>
              <p className="eyebrow mt-1.5">Founder</p>
            </div>

            {/* Est. pill */}
            <span className="badge-blush w-fit">Est. 1989</span>

            {/* Story text */}
            <div className="mt-1 space-y-4 text-base leading-relaxed text-inkMuted">
              <p>
                {s.aboutStory ||
                  "Chaudhry Furniture House began in a small Sialkot workshop with a simple belief: furniture should be built to outlive trends. Today we craft premium wooden furniture for homes, offices, hotels and restaurants across Pakistan and beyond."}
              </p>
              <p>
                {s.aboutExperience ||
                  "Every piece is made from carefully seasoned hardwood and finished by hand. Our craftsmen combine traditional joinery and hand-carving with modern design — so each design is both timeless and made for how you live today."}
              </p>
            </div>

            <Link
              href="/contact"
              className="mt-1 inline-flex items-center gap-2 font-sans text-sm font-medium text-terra hover:text-terraLight"
            >
              Visit the workshop <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="container-px pb-20">
        <Stats
          years={s.yearsExperience}
          projects={s.projectsCompleted}
          clients={s.happyClients}
          craftsmen={s.craftsmenCount}
        />
      </section>

      {/* Mission / Vision */}
      <section className="bg-stone py-20">
        <div className="container-px grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-inkBorder bg-parchment p-9">
              <p className="eyebrow">Mission</p>
              <p className="mt-4 font-display text-2xl font-bold leading-relaxed text-ink">
                {s.aboutMission ||
                  "To craft premium, honest, made-to-last wooden furniture that brings warmth and character to every space we touch."}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-3xl border border-inkBorder bg-parchment p-9">
              <p className="eyebrow">Vision</p>
              <p className="mt-4 font-display text-2xl font-bold leading-relaxed text-ink">
                {s.aboutVision ||
                  "To carry Pakistani craftsmanship to the world — recognised for quality, integrity and timeless design."}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="container-px py-20">
        <Reveal>
          <p className="eyebrow">Manufacturing</p>
          <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] font-bold text-ink">
            How a piece is <span className="text-terra">made.</span>
          </h2>
        </Reveal>
        <div className="mt-12">
          <Process image={s.processImageUrl || undefined} />
        </div>
      </section>

      {/* CTA */}
      <section className="container-px pb-24">
        <CTA />
      </section>
    </SiteShell>
  );
}
