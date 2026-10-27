import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a string to a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Build a WhatsApp click-to-chat URL.
 * Strips non-digits from the number and URL-encodes the prefilled message.
 */
export function whatsappUrl(rawNumber: string, message: string): string {
  const number = rawNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Parse a JSON string[] field stored in the DB; returns [] on failure. */
export function parseList(value?: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/** Format an integer with thousands separators. */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/**
 * Strip tracking query params from a social URL while preserving params that
 * are load-bearing for the link to work.
 *
 * Facebook profile.php URLs need ?id=<numeric_id> to resolve correctly — all
 * other params (mibextid, rdid, share_url …) are tracking junk.
 * For every other platform, all query params are stripped.
 */
export function cleanSocialUrl(raw: string | null | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  try {
    const u = new URL(raw.trim());
    if (u.hostname.includes("facebook.com") && u.pathname.includes("profile.php")) {
      const id = u.searchParams.get("id");
      return id ? `${u.origin}${u.pathname}?id=${id}` : `${u.origin}${u.pathname}`;
    }
    return `${u.origin}${u.pathname}`;
  } catch {
    return raw.trim() || undefined;
  }
}
