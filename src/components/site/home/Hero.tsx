"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Counter } from "@/components/motion/Counter";

type HeroProps = {
  heroImage?:       string;
  years?:           number;
  totalPieces?:     number;
  totalCategories?: number;
};

const WORDS = [
  { text: "Made",   accent: false },
  { text: "to",     accent: false },
  { text: "be",     accent: false },
  { text: "passed", accent: false },
  { text: "down.",  accent: true  },
];

export function Hero({
  heroImage,
  years = 25,
  totalPieces = 0,
  totalCategories = 0,
}: HeroProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const dimmer  = useTransform(scrollYProgress, [0, 0.6], [0, 0.25]);

  return (
    <section ref={ref} className="relative pt-[96px]">
      <div className="container-px pb-0 pt-4">
        <div className="relative h-[80vh] min-h-[440px] sm:min-h-[560px] overflow-hidden rounded-3xl">

          {/* Parallax image */}
          <motion.div style={{ y }} className="absolute inset-0 scale-110" suppressHydrationWarning>
            <Image
              src={heroImage || "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1600&q=80&fm=webp"}
              alt="Premium handcrafted wooden furniture by CH Furniture House"
              fill priority quality={85}
              sizes="(max-width:640px) 100vw, 1360px"
              className="object-cover"
            />
          </motion.div>

          {/* Base gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />

          {/* Scroll-driven extra dim */}
          <motion.div style={{ opacity: dimmer }} className="absolute inset-0 bg-ink" />

          {/* Noise grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          />

          {/* Content */}
          <div className="relative flex h-full flex-col justify-between p-8 sm:p-12">

            {/* Location label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-1.5 text-[11px] font-sans font-medium uppercase tracking-widest2 text-white/60"
              suppressHydrationWarning
            >
              <MapPin className="h-3 w-3" />
              Sialkot, Pakistan · Est. {new Date().getFullYear() - years}
            </motion.p>

            {/* Headline — word-by-word reveal */}
            <div>
              <h1 className="max-w-2xl font-display text-[clamp(2.8rem,7vw,5.5rem)] font-extrabold leading-[1.05] text-white">
                {WORDS.map((w, i) => (
                  <span
                    key={i}
                    className="overflow-hidden inline-block mr-[0.28em] align-top"
                  >
                    <motion.span
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.75, delay: 0.2 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                      className={`block${w.accent ? " text-blush" : ""}`}
                    >
                      {w.text}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.76, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 max-w-md text-base leading-relaxed text-white/75 sm:text-lg"
              >
                Solid-wood furniture handcrafted in Sialkot. More than{" "}
                {totalPieces > 0 ? `${totalPieces} pieces` : "hundreds of pieces"}, none
                mass-produced — most started only after you order them.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.96, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link href="/categories" className="btn-terra group">
                  Browse the collections
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link href="/contact" className="btn-ghost-white">
                  Visit the workshop
                </Link>
              </motion.div>
            </div>

            {/* Stats bar — animated counters */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 border-t border-white/20 pt-5 sm:gap-8"
            >
              {[
                { value: totalCategories, suffix: "",  label: "CATEGORIES" },
                { value: totalPieces,     suffix: "+", label: "PIECES" },
                { value: years,           suffix: "+", label: "YEARS" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="font-display text-2xl font-bold text-white">
                    {s.value > 0
                      ? <Counter value={s.value} suffix={s.suffix} />
                      : "—"}
                  </span>
                  <span className="text-[10px] font-sans font-medium uppercase tracking-widest2 text-white/50">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
