import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
const HeroSlider = dynamic(
  () => import("@/components/site/home/HeroSlider").then((m) => ({ default: m.HeroSlider })),
  {
    loading: () => (
      <div className="h-screen bg-stone pt-[96px]">
        <div className="h-10 bg-terra" />
      </div>
    ),
  }
);

const MarqueeStrip = dynamic(
  () => import("@/components/site/home/MarqueeStrip").then((m) => ({ default: m.MarqueeStrip })),
  { ssr: false }
);
import { FurnitureCardCompact } from "@/components/site/FurnitureCard";
import { FeaturedScroller } from "@/components/site/FeaturedScroller";
import { CategoryCard } from "@/components/site/CategoryCard";
import {
  SectionHeading,
  Process,
  Testimonials,
  FAQ,
  WorkshopBanner,
} from "@/components/site/home/Sections";
import { Reveal } from "@/components/motion/Reveal";
import {
  getAllCategories,
  getFeaturedFurniture,
  getTestimonials,
} from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { withRetry } from "@/lib/prisma";

const CircularCategoryShowcase = dynamic(
  () =>
    import("@/components/site/CircularCategoryShowcase").then(
      (m) => ({ default: m.CircularCategoryShowcase }),
    ),
  { ssr: false },
);

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE}/#faq`,
  mainEntity: [
    { "@type": "Question", name: "Do you make fully custom furniture?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Custom design is our specialty — share your dimensions, style and finish preferences and we build to order." } },
    { "@type": "Question", name: "Which woods do you work with?",
      acceptedAnswer: { "@type": "Answer", text: "We work with premium seasoned hardwoods including Sheesham (rosewood), walnut, teak and oak, plus quality engineered options where suitable." } },
    { "@type": "Question", name: "Do you ship outside Sialkot or Pakistan?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, we serve clients across Pakistan and arrange export for international buyers. Message us on WhatsApp for delivery details." } },
    { "@type": "Question", name: "How do I get a price quote?",
      acceptedAnswer: { "@type": "Answer", text: "Browse the collections and tap the WhatsApp button on any design, or use the contact form. We'll reply with pricing, wood options and timelines." } },
    { "@type": "Question", name: "How long does a piece take to make?",
      acceptedAnswer: { "@type": "Answer", text: "Typically 4–8 weeks depending on complexity. We do not rush the finishing — every coat needs to cure properly." } },
    { "@type": "Question", name: "Where is the workshop located?",
      acceptedAnswer: { "@type": "Answer", text: "Our workshop is in Mohala Sardaaran, Near HBL Bank, Kalaswala, Pasrur, Sialkot, Punjab, Pakistan. WhatsApp us to arrange a visit." } },
    { "@type": "Question", name: "What payment methods do you accept?",
      acceptedAnswer: { "@type": "Answer", text: "We accept cash, bank transfer (EasyPaisa, JazzCash, and direct bank transfer). Full payment details are shared after order confirmation." } },
  ],
};

export default async function HomePage() {
  const [settings, categories, featured, testimonials] = await withRetry(() =>
    Promise.all([
      getSettings(),
      getAllCategories(),
      getFeaturedFurniture(10),
      getTestimonials(6),
    ])
  );

  const totalPieces = categories.reduce((sum, c) => sum + (c.count ?? 0), 0);

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />

      {/* ── Hero slider (H1 is the brand eyebrow inside HeroSlider) ── */}
      <HeroSlider />
      <MarqueeStrip />

      {/* ── Catalogue — circular orbit showcase ── */}
      <CircularCategoryShowcase categories={categories} totalPieces={totalPieces} />

      {/* ── Featured pieces — horizontal scroll ── */}
      {featured.length > 0 && (
        <section className="bg-terra pt-8 pb-8 md:pt-14 md:pb-14">
          <div className="container-px">
            <div className="mb-4 flex items-end justify-between gap-4 md:mb-6">
              <div>
                <p className="eyebrow" style={{ color: "#F5E642" }}>Best Sellers</p>
                <h2 className="mt-2 font-display text-[clamp(1.7rem,3.5vw,2.6rem)] font-bold text-white">
                  Pieces worth the visit
                </h2>
              </div>
              <Link
                href="/categories"
                className="btn-ghost-white hidden shrink-0 sm:inline-flex"
              >
                See all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <FeaturedScroller onDark>
              {featured.map((f, i) => (
                <FurnitureCardCompact key={f.slug} item={f} index={i} card />
              ))}
            </FeaturedScroller>
          </div>
        </section>
      )}

      {/* ── Process — why it takes time ── */}
      <section className="container-px pb-20">
        <Reveal>
          <Process image={settings.processImageUrl || undefined} />
        </Reveal>
      </section>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <section className="container-px pb-20">
          <Reveal>
            <SectionHeading
              eyebrow="Kind words"
              title="Trusted by homes and businesses."
              accentWord="businesses."
            />
          </Reveal>
          <div className="mt-10">
            <Testimonials items={testimonials as import("@/components/site/home/Sections").TestimonialData[]} />
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="container-px pb-20">
        <Reveal>
          <SectionHeading eyebrow="Questions" title="Good to know." accentWord="Good" />
        </Reveal>
        <div className="mt-8">
          <FAQ />
        </div>
      </section>

      {/* ── Workshop Banner / CTA ── */}
      <WorkshopBanner
        whatsapp={settings.whatsapp}
        workshopVideoDesktopUrl={settings.workshopVideoDesktopUrl || undefined}
        workshopVideoDesktopPosterUrl={settings.workshopVideoDesktopPosterUrl || undefined}
        workshopVideoMobileUrl={settings.workshopVideoMobileUrl || undefined}
        workshopVideoMobilePosterUrl={settings.workshopVideoMobilePosterUrl || undefined}
      />
    </SiteShell>
  );
}
