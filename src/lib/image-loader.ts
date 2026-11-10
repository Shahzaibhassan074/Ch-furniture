'use client';

type LoaderParams = { src: string; width: number; quality?: number };

/**
 * Custom Next.js image loader.
 *
 * Cloudinary URLs get on-the-fly transformations injected so the browser
 * receives the right size/format directly from Cloudinary's CDN — bypassing
 * Vercel's /_next/image optimiser (and its Hobby-plan 402 errors).
 *
 * Every other URL (Supabase storage, Unsplash fallbacks, local /public) is
 * returned unchanged; Next.js renders an <img> pointing straight at the
 * original URL without proxying through Vercel.
 */
export default function imageLoader({ src, width, quality }: LoaderParams): string {
  if (src.includes('res.cloudinary.com')) {
    // Already has a transformation chain — don't double-transform.
    if (src.includes('/upload/f_')) return src;

    const q = quality != null ? quality : 'auto';
    return src.replace('/upload/', `/upload/f_auto,q_${q},c_limit,w_${width}/`);
  }

  // Local paths, Supabase storage, Unsplash, etc.
  // Append ?w= so Next.js recognises that width is used (suppresses the
  // "loader does not implement width" console warning). The server ignores it.
  const sep = src.includes('?') ? '&' : '?';
  return `${src}${sep}w=${width}`;
}
