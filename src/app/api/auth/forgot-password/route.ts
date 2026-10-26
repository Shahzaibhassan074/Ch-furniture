import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";
import { sendPasswordResetEmail } from "@/lib/email";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? "https://chfurniturehouse.com";
const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Simple in-memory rate limiter — 5 requests per IP per 15 min
const _rl = new Map<string, { n: number; until: number }>();
function isAllowed(ip: string): boolean {
  const now = Date.now();
  const rec = _rl.get(ip);
  if (!rec || now > rec.until) { _rl.set(ip, { n: 1, until: now + 15 * 60_000 }); return true; }
  if (rec.n >= 5) return false;
  rec.n++;
  return true;
}

function isSameOrigin(req: NextRequest): boolean {
  const origin  = req.headers.get("origin")  ?? "";
  const referer = req.headers.get("referer") ?? "";
  return origin.startsWith(SITE_URL) || referer.startsWith(SITE_URL);
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  // Silently absorb rate-limit hits — don't reveal anything
  if (!isAllowed(ip)) return NextResponse.json({ ok: true });

  const body = await req.json().catch(() => ({}));
  const email = ((body.email as string) ?? "").toLowerCase().trim();

  // Always return the same response regardless of whether the email matched
  const ok = NextResponse.json({ ok: true });

  if (!email || !ADMIN_EMAIL || email !== ADMIN_EMAIL) return ok;

  // Invalidate any existing token for this email
  await supabase.from("password_reset_tokens").delete().eq("email", email);

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  const { error } = await supabase
    .from("password_reset_tokens")
    .insert({ email, token, expires_at: expiresAt });

  if (error) {
    console.error("[forgot-password] DB error:", error.message);
    return ok; // still return ok — don't leak DB errors
  }

  const resetUrl = `${SITE_URL}/admin/reset-password?token=${token}`;
  await sendPasswordResetEmail(email, resetUrl).catch((e) =>
    console.error("[forgot-password] email error:", e)
  );

  return ok;
}
