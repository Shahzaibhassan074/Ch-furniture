"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { MessageCircle, X, Phone } from "lucide-react";
import { useSheet } from "@/context/sheet-context";
import { whatsappUrl } from "@/lib/utils";

type Props = {
  number: string;
  phone: string;
  message: string;
};

type Option = {
  emoji: string;
  title: string;
  subtitle: string;
  buildMessage: (ctx: { productName?: string; productUrl?: string } | null) => string;
};

const OPTIONS: Option[] = [
  {
    emoji: "🎁",
    title: "Jahez package",
    subtitle: "Complete sets for weddings & new homes",
    buildMessage: () =>
      "Assalam-o-Alaikum, I'd like details about your Jahez packages.",
  },
  {
    emoji: "📐",
    title: "Custom size & quote",
    subtitle: "Tell us your exact dimensions",
    buildMessage: () =>
      "Assalam-o-Alaikum, I want a custom piece. My size is: ",
  },
  {
    emoji: "🪑",
    title: "Ask about a design",
    subtitle: "Questions about a specific product",
    buildMessage: (ctx) =>
      ctx?.productName
        ? `Assalam-o-Alaikum, I have a question about the ${ctx.productName}.${ctx.productUrl ? ` (${ctx.productUrl})` : ""}`
        : "Assalam-o-Alaikum, I have a question about a design.",
  },
  {
    emoji: "🏭",
    title: "Book a workshop visit",
    subtitle: "Come see the craftsmanship in person",
    buildMessage: () =>
      "Assalam-o-Alaikum, I'd like to visit the workshop. Preferred day/time: ",
  },
];

export function WhatsAppSheet({ number, phone, message }: Props) {
  const { waOpen, closeWA, waContext } = useSheet();
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Focus close button on open */
  useEffect(() => {
    if (waOpen) {
      const id = setTimeout(() => closeRef.current?.focus(), 60);
      return () => clearTimeout(id);
    }
  }, [waOpen]);

  /* Esc to close */
  useEffect(() => {
    if (!waOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWA();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [waOpen, closeWA]);

  /* Scroll lock */
  useEffect(() => {
    if (waOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [waOpen]);

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.y > 80) closeWA();
  }

  return (
    <AnimatePresence>
      {waOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-ink/50 md:hidden"
            onClick={closeWA}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Contact CH Furniture House"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[71] rounded-t-[24px] bg-cream pb-safe md:hidden"
            style={{ maxHeight: "92dvh", overflowY: "auto" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-inkBorder" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-3 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-display text-[17px] font-bold text-ink">Chat with the workshop</p>
                  <p className="text-[12px] font-sans text-inkMuted">Pick a topic — we reply fast</p>
                </div>
              </div>
              <button
                ref={closeRef}
                onClick={closeWA}
                aria-label="Close WhatsApp sheet"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-inkBorder text-inkMuted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Option rows */}
            <div className="px-4 space-y-2.5 pb-4">
              {OPTIONS.map((opt) => (
                <a
                  key={opt.title}
                  href={whatsappUrl(number, opt.buildMessage(waContext))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeWA}
                  className="flex items-center gap-3 rounded-2xl border border-inkBorder bg-white p-4 transition-colors hover:border-terra active:bg-parchment"
                >
                  <span className="text-[22px]" aria-hidden="true">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-[14px] font-semibold text-ink">{opt.title}</p>
                    <p className="text-[12px] text-inkMuted truncate">{opt.subtitle}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Bottom actions */}
            <div className="px-4 pb-6 grid grid-cols-2 gap-3">
              <a
                href={whatsappUrl(number, message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeWA}
                className="flex h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#25D366] font-sans text-[14px] font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Open WhatsApp
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex h-[50px] items-center justify-center gap-2 rounded-2xl border-2 border-inkBorder font-sans text-[14px] font-semibold text-ink"
              >
                <Phone className="h-4 w-4" />
                Call {phone}
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
