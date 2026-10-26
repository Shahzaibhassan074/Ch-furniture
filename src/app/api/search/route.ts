import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { searchFurniture } from "@/lib/queries";

export const dynamic = "force-dynamic";

// Rate limit: 30 requests per IP per minute
const _rl = new Map<string, { n: number; until: number }>();
function isAllowed(ip: string): boolean {
  const now = Date.now();
  const rec = _rl.get(ip);
  if (!rec || now > rec.until) { _rl.set(ip, { n: 1, until: now + 60_000 }); return true; }
  if (rec.n >= 30) return false;
  rec.n++;
  return true;
}

const cachedSearch = (q: string) =>
  unstable_cache(
    () => searchFurniture(q),
    [`search-${q}`],
    { revalidate: 120, tags: ["furniture"] }
  )();

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!isAllowed(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase().slice(0, 100);
  if (!q) return NextResponse.json({ results: [] });

  const results = await cachedSearch(q);
  return NextResponse.json({ results }, {
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" },
  });
}
