"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

// ssr:false so the video component never runs on the server.
// The parent always renders a stable <img> poster that matches server HTML;
// the video overlays it once the module loads on the client.
const WorkshopVideoPlayer = dynamic(
  () => import("./WorkshopVideo").then((m) => ({ default: m.WorkshopVideo })),
  { ssr: false }
);
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CHLogo } from "@/components/site/CHLogo";
import { ArrowRight, Star, Plus, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { ProcessMobileCarousel } from "./ProcessMobileCarousel";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";

/* ─── Shared animation variants ─────────────────────────────────────────────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const fadeSlideUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};
const fadeSlideLeft = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x:   0, transition: { duration: 0.5,  ease: [0.16, 1, 0.3, 1] } },
};

/* ─── Section Heading ────────────────────────────────────────────────────────── */
export function SectionHeading({
  eyebrow,
  title,
  accentWord,
  description,
  align = "left",
  action,
}: {
  eyebrow:      string;
  title:        string;
  accentWord?:  string;
  description?: string;
  align?:       "left" | "center";
  action?:      { label: string; href: string };
}) {
  // Split at accentWord using React nodes — no dangerouslySetInnerHTML needed
  const titleNode = (() => {
    if (!accentWord) return <>{title}</>;
    const idx = title.indexOf(accentWord);
    if (idx === -1) return <>{title}</>;
    return (
      <>
        {title.slice(0, idx)}
        <span className="text-terra">{accentWord}</span>
        {title.slice(idx + accentWord.length)}
      </>
    );
  })();

  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight text-ink">
          {titleNode}
        </h2>
        {action && (
          <Link
            href={action.href}
            className="flex items-center gap-1.5 text-sm font-sans font-medium text-inkMuted hover:text-terra transition-colors"
          >
            {action.label} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {description && <p className="mt-3 text-base text-inkMuted">{description}</p>}
    </div>
  );
}

/* ─── Stats bar ─────────────────────────────────────────────────────────────── */
export function Stats({
  years,
  projects,
  clients,
  craftsmen,
}: {
  years:     number;
  projects:  number;
  clients:   number;
  craftsmen: number;
}) {
  const items = [
    { value: years,     suffix: "+", label: "Years of Craft"   },
    { value: projects,  suffix: "+", label: "Pieces Delivered" },
    { value: clients,   suffix: "+", label: "Happy Clients"    },
    { value: craftsmen, suffix: "",  label: "Master Craftsmen" },
  ];
  return (
    <div className="grid grid-cols-2 gap-px rounded-2xl border border-inkBorder bg-inkBorder overflow-hidden md:grid-cols-4">
      {items.map((s, i) => (
        <Reveal key={i} delay={i * 0.07} className="bg-parchment p-8 text-center">
          <div className="font-display text-5xl font-extrabold text-terra">
            <Counter value={s.value} suffix={s.suffix} />
          </div>
          <p className="mt-2 text-[10px] font-sans font-medium uppercase tracking-widest2 text-inkMuted">
            {s.label}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/* ─── Catalogue numbered list ────────────────────────────────────────────────── */
export type CatListItem = {
  slug:      string;
  name:      string;
  count?:    number;
  thumbUrl?: string | null;
};

export function CatalogueList({
  categories,
  totalPieces,
}: {
  categories:  CatListItem[];
  totalPieces: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const previewCat = hovered
    ? categories.find((c) => c.slug === hovered)
    : categories[0];

  return (
    <section className="container-px py-20 md:py-28">
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The Catalogue</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight text-ink">
              {categories.length} categories,{" "}
              <span className="text-terra">{totalPieces} pieces</span> handcrafted.
            </h2>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1.5 text-sm font-sans font-medium text-inkMuted hover:text-terra transition-colors"
          >
            All collections <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Staggered numbered list */}
        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="divide-y divide-inkBorder border-y border-inkBorder"
        >
          {categories.map((cat, i) => (
            <motion.li
              key={cat.slug}
              variants={fadeSlideLeft}
              onHoverStart={() => setHovered(cat.slug)}
              onHoverEnd={() => setHovered(null)}
            >
              <Link
                href={`/category/${cat.slug}`}
                className="group flex items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-5">
                  <motion.span
                    animate={{ scale: hovered === cat.slug ? 1.25 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-7 font-sans text-sm font-medium text-terra"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.span>
                  <motion.span
                    animate={{ x: hovered === cat.slug ? 6 : 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-xl font-semibold text-ink sm:text-2xl group-hover:text-terra transition-colors"
                  >
                    {cat.name}
                  </motion.span>
                </div>
                {cat.count != null && (
                  <span className="font-sans text-sm text-inkMuted transition-colors group-hover:text-terra">
                    {cat.count} pieces
                  </span>
                )}
              </Link>
            </motion.li>
          ))}
        </motion.ol>

        {/* Preview image — desktop only */}
        <div className="hidden lg:block">
          <AnimatePresence mode="wait">
            <AnimatedPreview key={previewCat?.slug ?? "empty"} cat={previewCat} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function AnimatedPreview({ cat }: { cat?: CatListItem }) {
  if (!cat?.thumbUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-full min-h-[400px] items-center justify-center rounded-2xl bg-stone text-sm text-inkMuted"
      >
        No preview
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="relative h-full min-h-[400px] overflow-hidden rounded-2xl"
    >
      <Image src={cat.thumbUrl} alt={cat.name} fill className="object-cover" sizes="360px" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.12 }}
        className="absolute bottom-5 left-5 font-display text-xl font-bold text-white"
      >
        {cat.name}
      </motion.p>
    </motion.div>
  );
}

/* ─── Why Us ─────────────────────────────────────────────────────────────────── */
/* ─── Process ────────────────────────────────────────────────────────────────── */
export function Process({ image }: { image?: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const steps = [
    { n: "01", title: "Consultation & Design",      body: "We discuss your space, style and requirements, then translate them into a detailed design you approve." },
    { n: "02", title: "Wood Selection & Seasoning", body: "Premium seasoned timber is hand-selected. We do not rush the drying — that is what prevents warping later." },
    { n: "03", title: "Crafting & Hand-Carving",   body: "Skilled craftsmen cut, join and hand-carve each component. Carving is not decoration — it is the structure." },
    { n: "04", title: "Finishing & Delivery",       body: "Premium finishing and quality checks, then careful delivery and setup at your home. We take the packaging." },
  ];

  return (
    <>
      {/* Mobile-only swipe carousel (hidden on md+) */}
      <ProcessMobileCarousel />

      {/* Desktop layout (hidden on mobile) */}
      <div ref={ref} className="hidden md:grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Parallax image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
            <Image
              src={image || "https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=900&q=80"}
              alt="CH Furniture House workshop craftsmen"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </motion.div>
          <div className="absolute bottom-5 left-5 right-5 font-sans text-xs text-white/70">
            Sialkot workshop · Master craftsmen at work
          </div>
        </div>

        {/* Steps with stagger */}
        <div>
          <Reveal>
            <p className="eyebrow">Made to order</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,3.5vw,2.8rem)] font-bold leading-tight text-ink">
              Why it takes{" "}
              <span className="text-terra">several weeks.</span>
            </h2>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
            className="mt-8 divide-y divide-inkBorder"
          >
            {steps.map((s) => (
              <motion.div key={s.n} variants={fadeSlideUp} className="flex items-start gap-5 py-5">
                <span className="mt-0.5 font-sans text-sm font-medium text-terra">{s.n}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-inkMuted">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}

/* ─── Testimonials ───────────────────────────────────────────────────────────── */
export type TestimonialData = {
  author: string;
  role?:  string | null;
  quote:  string;
  rating: number;
};

export function Testimonials({ items }: { items: TestimonialData[] }) {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplayPlugin.current]
  );

  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snapCount,    setSnapCount]    = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedSnap(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnapCount(emblaApi.scrollSnapList().length);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); emblaApi.off("reInit", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!items.length) return null;

  return (
    <div className="relative">
      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y gap-4 sm:gap-5">
          {items.map((t, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_calc(50%-10px)] md:flex-[0_0_calc(33.333%-14px)]"
            >
              <figure className="flex h-full flex-col rounded-2xl border border-inkBorder bg-white p-6 shadow-[0_2px_16px_rgba(28,26,24,0.06)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(28,26,24,0.11)]">
                {/* Decorative quote mark */}
                <svg viewBox="0 0 32 24" className="mb-4 h-7 w-7 fill-terra/20" aria-hidden="true">
                  <path d="M0 24V14.4C0 6.08 4.48 1.28 13.44 0l1.28 2.56C10.56 3.84 8.32 6.08 7.68 9.6H13.44V24H0zm18.56 0V14.4C18.56 6.08 23.04 1.28 32 0l1.28 2.56C29.12 3.84 26.88 6.08 26.24 9.6H32V24H18.56z" />
                </svg>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-terra text-terra" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="mt-4 flex-1 font-display text-lg leading-relaxed text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <figcaption className="mt-5 flex items-center gap-3 border-t border-inkBorder pt-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terra/10 font-sans text-sm font-bold text-terra">
                    {t.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-ink">{t.author}</p>
                    {t.role && (
                      <p className="mt-0.5 font-sans text-xs uppercase tracking-wider text-inkMuted">
                        {t.role}
                      </p>
                    )}
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* Controls: prev · dots · next */}
      <div className="mt-7 flex items-center justify-center gap-3">
        <button
          onClick={scrollPrev}
          aria-label="Previous review"
          className="hidden h-9 w-9 items-center justify-center rounded-full border border-inkBorder bg-white text-inkMuted shadow-sm transition-colors hover:border-terra hover:text-terra md:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex gap-2">
          {Array.from({ length: snapCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Review ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedSnap ? "w-6 bg-terra" : "w-2 bg-inkBorder hover:bg-inkMuted"
              }`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          aria-label="Next review"
          className="hidden h-9 w-9 items-center justify-center rounded-full border border-inkBorder bg-white text-inkMuted shadow-sm transition-colors hover:border-terra hover:text-terra md:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Do you make fully custom furniture?",        a: "Yes. Custom design is our specialty — share your dimensions, style and finish preferences and we build to order." },
  { q: "Which woods do you work with?",              a: "We work with premium seasoned hardwoods including Sheesham (rosewood), walnut, teak and oak, plus quality engineered options where suitable." },
  { q: "Do you ship outside Sialkot or Pakistan?",   a: "Yes, we serve clients across Pakistan and arrange export for international buyers. Message us on WhatsApp for delivery details." },
  { q: "How do I get a price quote?",                a: "Browse the collections and tap the WhatsApp button on any design, or use the contact form. We'll reply with pricing, wood options and timelines." },
  { q: "How long does a piece take to make?",        a: "Typically 4–8 weeks depending on complexity. We do not rush the finishing — every coat needs to cure properly." },
  { q: "Where is the workshop located?",             a: "Our workshop is in Mohala Sardaaran, Near HBL Bank, Kalaswala, Pasrur, Sialkot, Punjab, Pakistan. WhatsApp us to arrange a visit." },
  { q: "What payment methods do you accept?",        a: "We accept cash, bank transfer (EasyPaisa, JazzCash, and direct bank transfer). Full payment details are shared after order confirmation." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-inkBorder border-y border-inkBorder">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg font-semibold text-ink md:text-xl">{f.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="shrink-0 text-terra"
              >
                <Plus className="h-5 w-5" />
              </motion.span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <p className="pb-6 text-inkMuted">{f.a}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Workshop Banner ────────────────────────────────────────────────────────── */
export function WorkshopBanner({
  image,
  whatsapp,
  workshopVideoDesktopUrl,
  workshopVideoDesktopPosterUrl,
  workshopVideoMobileUrl,
  workshopVideoMobilePosterUrl,
}: {
  image?:    string;
  whatsapp?: string;
  workshopVideoDesktopUrl?:       string;
  workshopVideoDesktopPosterUrl?: string;
  workshopVideoMobileUrl?:        string;
  workshopVideoMobilePosterUrl?:  string;
}) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: bannerRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const hasVideo = !!workshopVideoDesktopUrl;
  const fallback = image || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1600&q=80";

  return (
    <div ref={bannerRef} className="container-px py-16 relative">
      <div className="relative overflow-hidden rounded-3xl">
        {hasVideo ? (
          <>
            {/* Poster rendered identically on server + client — no hydration mismatch */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={workshopVideoDesktopPosterUrl || fallback}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Client-only (ssr:false) video overlays the poster once JS loads */}
            <WorkshopVideoPlayer
              desktopSrc={workshopVideoDesktopUrl!}
              desktopPoster={workshopVideoDesktopPosterUrl}
              mobileSrc={workshopVideoMobileUrl}
              mobilePoster={workshopVideoMobilePosterUrl}
            />
          </>
        ) : (
          <motion.div style={{ y: imgY }} className="absolute inset-0 scale-[1.12]">
            <Image
              src={fallback}
              alt="CH Furniture House workshop Sialkot"
              fill className="object-cover" sizes="100vw"
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/25" />

        <div className="relative flex min-h-[320px] sm:min-h-[420px] flex-col justify-between p-10 sm:p-14">
          {/* Logo replaces THE WORKSHOP eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <CHLogo
              className="h-auto w-36 sm:w-48 drop-shadow-xl"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </motion.div>

          {/* Buttons at the bottom-left */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 hidden flex-wrap gap-3 sm:flex"
          >
            <Link href="/contact" className="btn-terra group">
              Book a visit
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-white"
              >
                <MessageCircle className="h-4 w-4" /> Message the workshop
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── CTA ────────────────────────────────────────────────────────────────────── */
export function CTA() {
  return (
    <Reveal>
      <div className="rounded-3xl bg-inkSubtle p-10 text-center md:p-16">
        <p className="eyebrow">Let&apos;s build something timeless</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight text-ink">
          Have a piece in mind?{" "}
          <span className="text-terra">Tell us about your project.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-inkMuted">
          Browse the collections and send us a WhatsApp — we&apos;ll reply with pricing, wood options and delivery timeline.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn-terra group">
            Get in Touch
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link href="/categories" className="btn-ghost">
            Browse Collections
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
