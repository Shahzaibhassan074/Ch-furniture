import type { Metadata } from "next";
import { MapPin, Phone, MessageCircle, Mail, Clock } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactForm } from "@/components/site/ContactForm";
import { HangingPhone } from "@/components/site/HangingPhone";
import { MobileWorkshopBlock } from "@/components/site/MobileWorkshopBlock";
import { Reveal } from "@/components/motion/Reveal";
import { getSettings } from "@/lib/settings";
import { whatsappUrl } from "@/lib/utils";

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";

export const metadata: Metadata = {
  title: "Contact & Workshop — Sialkot",
  description:
    "Contact CH Furniture House in Sialkot, Pakistan — WhatsApp, call, email or visit the workshop. Custom wooden furniture made to your specifications.",
  keywords: [
    "CH Furniture House contact",
    "furniture workshop Sialkot",
    "custom furniture enquiry Pakistan",
    "furniture WhatsApp Pakistan",
    "order wooden furniture Sialkot",
    "furniture showroom Sialkot",
  ],
  alternates: { canonical: `${SITE}/contact` },
  openGraph: {
    title: "Contact & Workshop — Sialkot",
    description:
      "Visit our workshop in Sialkot or message us on WhatsApp. Custom wooden furniture built to your specifications.",
    url: `${SITE}/contact`,
    type: "website",
    images: [{ url: `${SITE}/opengraph-image`, width: 1200, height: 630, alt: "CH Furniture House Workshop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact CH Furniture House",
    description: "Visit the workshop in Sialkot or WhatsApp us for custom furniture enquiries.",
    images: [`${SITE}/opengraph-image`],
  },
};

export default async function ContactPage() {
  const s = await getSettings();
  const mapSrc =
    s.mapEmbedUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`;

  const localBizLd = {
    "@context": "https://schema.org",
    "@type": ["FurnitureStore", "LocalBusiness"],
    "@id": `${SITE}/#business`,
    name: "CH Furniture House",
    url: SITE,
    telephone: s.phone,
    email: s.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mohala Sardaaran, Near HBL Bank, Kalaswala",
      addressLocality: "Pasrur",
      addressRegion: "Sialkot, Punjab",
      addressCountry: "PK",
      postalCode: "51310",
    },
    geo: { "@type": "GeoCoordinates", latitude: "32.2608", longitude: "74.6618" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
    contactPoint: [
      { "@type": "ContactPoint", telephone: s.phone, contactType: "customer service", availableLanguage: ["English","Urdu"] },
      ...(s.whatsapp ? [{ "@type": "ContactPoint", telephone: s.whatsapp, contactType: "sales", contactOption: "WhatsApp" }] : []),
    ],
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizLd) }} />

      {/* Mobile workshop block — map + quick-action card */}
      <div className="md:hidden">
        <MobileWorkshopBlock
          mapSrc={mapSrc}
          address={s.address}
          phone={s.phone}
          whatsapp={s.whatsapp}
          whatsappMessage={s.whatsappMessage}
          businessHours={s.businessHours}
          categoryThumbs={[]}
        />
      </div>

      <div className="container-px pt-28 pb-10 md:pt-32 relative overflow-visible">
        <HangingPhone />
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Workshop" }]} />
        <Reveal>
          <p className="eyebrow mt-8">The Workshop</p>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-tight text-ink">
            Visit our workshop in{" "}
            <span className="text-terra">Sialkot.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-inkMuted">
            Message us on WhatsApp for the fastest reply, or send a note below. We'll get back with
            pricing, wood options and timelines within one business day.
          </p>
        </Reveal>
      </div>

      <section className="container-px grid gap-12 pb-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Details */}
        <Reveal>
          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-terra" />
              <div>
                <p className="eyebrow">Workshop Address</p>
                <p className="mt-1 text-ink">{s.address}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-terra" />
              <div>
                <p className="eyebrow">Business Hours</p>
                <p className="mt-1 whitespace-pre-line text-ink">{s.businessHours}</p>
              </div>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <a
                href={whatsappUrl(s.whatsapp, s.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-inkBorder bg-parchment p-4 transition-colors hover:border-terra"
              >
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                <span className="text-sm">
                  <span className="font-medium text-ink">WhatsApp</span>
                  <br />
                  <span className="text-inkMuted">{s.whatsapp}</span>
                </span>
              </a>
              <a
                href={`tel:${s.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 rounded-2xl border border-inkBorder bg-parchment p-4 transition-colors hover:border-terra"
              >
                <Phone className="h-5 w-5 text-terra" />
                <span className="text-sm">
                  <span className="font-medium text-ink">Call</span>
                  <br />
                  <span className="text-inkMuted">{s.phone}</span>
                </span>
              </a>
              {s.email && (
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-3 rounded-2xl border border-inkBorder bg-parchment p-4 transition-colors hover:border-terra sm:col-span-2"
                >
                  <Mail className="h-5 w-5 text-terra" />
                  <span className="text-sm">
                    <span className="font-medium text-ink">Email</span>
                    <br />
                    <span className="text-inkMuted">{s.email}</span>
                  </span>
                </a>
              )}
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.08}>
          <div className="rounded-3xl border border-inkBorder bg-parchment p-5 sm:p-8 md:p-10">
            <h2 className="font-display text-2xl font-bold text-ink">Send a message</h2>
            <p className="mt-1 text-sm text-inkMuted">We typically reply within a business day.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Map — desktop only (mobile has the map inside MobileWorkshopBlock above) */}
      <section className="hidden md:block container-px pb-24">
        <div className="overflow-hidden rounded-3xl border border-inkBorder">
          <div className="relative h-[260px] sm:h-[360px] md:h-[420px]">
            <iframe
              src={mapSrc}
              title="CH Furniture House location"
              width="100%"
              height="100%"
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
