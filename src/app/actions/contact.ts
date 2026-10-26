"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { sendContactNotification } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email.").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().min(5, "Tell us a little about what you need."),
});

// In-memory rate limiter: 3 submissions per IP per hour
const _rl = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = _rl.get(ip);
  if (!entry || now > entry.resetAt) {
    _rl.set(ip, { count: 1, resetAt: now + 3_600_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

export type ContactState = { ok: boolean; error?: string };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const ip = headers().get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return { ok: false, error: "Too many submissions. Please wait a while before trying again." };
  }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Please check the form." };
  }

  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    return { ok: false, error: "Could not save your message. Please try WhatsApp or call us directly." };
  }

  sendContactNotification({
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  }).catch(() => {});

  return { ok: true };
}
