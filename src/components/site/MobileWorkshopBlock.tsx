"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSheet } from "@/context/sheet-context";

type Props = {
  mapSrc: string;
  address: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  businessHours: string;
  categoryThumbs?: string[];
};

export function MobileWorkshopBlock({
  mapSrc,
  address,
  phone,
  businessHours,
  categoryThumbs = [],
}: Props) {
  const { openWA } = useSheet();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Karachi",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      weekday: "long",
    }).formatToParts(now);

    const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
    const h = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
    const m = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
    const totalMin = h * 60 + m;
    const isWeekday = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].includes(weekday);

    // 9:00 (540 min) to 20:00 (1200 min)
    setIsOpen(isWeekday && totalMin >= 540 && totalMin < 1200);
  }, []);

  return (
    <div className="md:hidden">
      {/* Map */}
      <div className="relative h-[230px] overflow-hidden rounded-b-2xl">
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

      {/* Overlapping card */}
      <div className="-mt-5 relative z-10 rounded-2xl shadow-lg mx-4 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display font-bold text-[18px] text-ink leading-tight">
            Sialkot workshop
          </h2>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-sans font-semibold shrink-0",
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isOpen ? "bg-green-500" : "bg-red-500"
              )}
            />
            {isOpen ? "Open now" : "Closed"}
          </span>
        </div>

        <p className="mt-2 text-[13px] font-sans text-inkMuted leading-snug">{address}</p>
        <p className="mt-1 text-[12px] font-sans text-inkMuted">{businessHours}</p>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <a
            href={`https://maps.google.com/maps?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 rounded-xl border border-inkBorder bg-parchment p-3 text-center"
          >
            <MapPin className="h-5 w-5 text-terra" />
            <span className="text-[11px] font-sans font-medium text-ink">Directions</span>
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex flex-col items-center gap-1 rounded-xl border border-inkBorder bg-parchment p-3 text-center"
          >
            <Phone className="h-5 w-5 text-terra" />
            <span className="text-[11px] font-sans font-medium text-ink">Call</span>
          </a>
          <button
            onClick={() => openWA()}
            className="flex flex-col items-center gap-1 rounded-xl border border-[#25D366] bg-[#25D366]/10 p-3 text-center"
          >
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            <span className="text-[11px] font-sans font-medium text-[#25D366]">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Inside the showroom */}
      {categoryThumbs.length > 0 && (
        <div className="mt-6 px-4">
          <p className="text-[12px] font-sans font-medium uppercase tracking-widest2 text-inkMuted mb-3">
            Inside the showroom
          </p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {categoryThumbs.map((src, i) => (
              <div
                key={i}
                className="relative h-24 w-32 shrink-0 rounded-2xl overflow-hidden bg-stone"
              >
                <Image
                  src={src}
                  alt={`Showroom photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
