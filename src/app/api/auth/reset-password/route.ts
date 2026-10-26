import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? "https://chfurniturehouse.com";

// Simple in-memory rate limiter — 10 attempts per IP per 15 min
const _rl = new Map<string, { n: number; until: number }>();
function isAllowed(ip: string): boolean {
  const now = Date.now();
  const rec = _rl.get(ip);
  if (!rec || now > rec.until) { _rl.set(ip, { n: 1, until: now + 15 * 60_000 }); return true; }
  if (rec.n >= 10) return false;
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
  if (!isAllowed(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const token = ((body.token as string) ?? "").trim();
  const password = (body.password as string) ?? "";

  if (!token || password.length < 8) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Look up the token
  const { data: record } = await supabase
    .from("password_reset_tokens")
    .select("email, expires_at")
    .eq("token", token)
    .single();

  if (!record) {
    return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 400 });
  }

  if (new Date(record.expires_at) < new Date()) {
    await supabase.from("password_reset_tokens").delete().eq("token", token);
    return NextResponse.json({ error: "This reset link has expired. Request a new one." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const { error } = await supabase
    .from("admin")
    .update({ password_hash: passwordHash })
    .eq("email", record.email);

  if (error) {
    console.error("[reset-password] DB error:", error.message);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }

  // Consume the token so it can't be reused
  await supabase.from("password_reset_tokens").delete().eq("token", token);

  return NextResponse.json({ ok: true });
}
