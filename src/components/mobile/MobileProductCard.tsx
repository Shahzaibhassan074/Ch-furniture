"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavourites } from "@/context/favourites-context";

type Props = {
  slug: string;
  name: string;
  meta: string;
  categorySlug: string;
  imageUrl: string | null;
  index: number;
  whatsapp: string;
};

export function MobileProductCard({
  slug,
  name,
  meta,
  categorySlug,
  imageUrl,
  index,
  whatsapp,
}: Props) {
  const { toggle, isFav } = useFavourites();
  const fav = isFav(slug);

  const digits = whatsapp.replace(/\D/g, "");
  const waUrl = `https://wa.me/${digits}?text=${encodeURIComponent(
    `Hello CH FURNITURE,\nI'm interested in the ${name} shown on your website. Please provide pricing, available wood options, delivery information, and customization options.`
  )}`;
  const productHref = `/category/${categorySlug}/${slug}`;

  const isHandMade = index % 3 === 1;
  const badgeLabel = isHandMade ? "Hand made" : "Best seller";
  const badgeBg = isHandMade ? "#23402F" : "#A64A25";

  return (
    <article style={{ display: "flex", flexDirection: "column" }}>
      {/* Image container */}
      <div
        style={{
          position: "relative",
          aspectRatio: "4 / 5",
          background: "#F5F3EF",
          overflow: "hidden",
          borderRadius: "12px",
        }}
      >
        <Link
          href={productHref}
          aria-label={`Open ${name}`}
          style={{ position: "absolute", inset: 0 }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              style={{ objectFit: "cover", display: "block" }}
              sizes="(max-width: 768px) 50vw"
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#5F5A54",
                fontSize: "11px",
              }}
            >
              No image
            </div>
          )}
        </Link>

        {/* Badge */}
        <span
          style={{
            position: "absolute",
            left: "8px",
            top: "8px",
            padding: "4px 9px",
            borderRadius: "10px",
            background: badgeBg,
            color: "#FFFFFF",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: ".8px",
            textTransform: "uppercase",
          }}
        >
          {badgeLabel}
        </span>

        {/* Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle({ id: slug, slug, categorySlug, name, image: imageUrl || "" });
          }}
          aria-pressed={fav}
          aria-label={`${fav ? "Remove" : "Save"} ${name}`}
          style={{
            position: "absolute",
            right: "4px",
            top: "4px",
            width: "40px",
            height: "40px",
            borderRadius: "20px",
            border: 0,
            background: "rgba(255,255,255,.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={fav ? "#B3261E" : "none"}
            stroke={fav ? "#B3261E" : "#1A1A1A"}
            strokeWidth="1.9"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
        </button>
      </div>

      {/* Name + meta */}
      <Link
        href={productHref}
        style={{ display: "block", paddingTop: "8px", textDecoration: "none", color: "inherit" }}
      >
        <span
          style={{
            display: "block",
            fontSize: "13.5px",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#1A1A1A",
          }}
        >
          {name}
        </span>
        {meta && (
          <span
            style={{
              display: "block",
              marginTop: "2px",
              fontSize: "12px",
              color: "#5F5A54",
            }}
          >
            {meta}
          </span>
        )}
      </Link>

      {/* Ask price */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: "8px",
          height: "38px",
          borderRadius: "19px",
          background: "#1B7F45",
          color: "#FFFFFF",
          fontSize: "12.5px",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          textDecoration: "none",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" />
        </svg>
        Ask price
      </a>
    </article>
  );
}
