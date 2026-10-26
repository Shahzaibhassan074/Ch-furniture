/**
 * Runtime environment check — call inside a request handler or server action,
 * never at module top-level, so the build is never affected.
 *
 * Usage:  import { requireEnv } from "@/lib/env";
 *         requireEnv();  // throws with a clear list of missing vars
 */

const REQUIRED: { name: string; note: string }[] = [
  { name: "NEXT_PUBLIC_SUPABASE_URL",          note: "Supabase project URL" },
  { name: "SUPABASE_SERVICE_ROLE_KEY",          note: "Supabase service role key (keep secret)" },
  { name: "NEXTAUTH_SECRET",                    note: "Random 32-byte secret for JWT signing" },
  { name: "NEXTAUTH_URL",                       note: "Full production URL, e.g. https://chfurniturehouse.com" },
  { name: "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",  note: "Cloudinary cloud name" },
  { name: "CLOUDINARY_API_KEY",                 note: "Cloudinary API key" },
  { name: "CLOUDINARY_API_SECRET",              note: "Cloudinary API secret (keep secret)" },
  { name: "RESEND_API_KEY",                     note: "Resend API key for password-reset emails" },
  { name: "NEXT_PUBLIC_SITE_URL",               note: "Full production URL for canonical/OG tags" },
  { name: "ADMIN_EMAIL",                        note: "Admin account email (used by forgot-password)" },
];

export function requireEnv(): void {
  const missing = REQUIRED.filter(({ name }) => !process.env[name]);
  if (missing.length === 0) return;

  const lines = missing
    .map(({ name, note }) => `  ${name.padEnd(40)} — ${note}`)
    .join("\n");

  throw new Error(
    `[env] ${missing.length} required environment variable(s) are not set:\n${lines}\n` +
      "Add them in Vercel → Project Settings → Environment Variables → Production."
  );
}
