"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { CHLogo } from "@/components/site/CHLogo";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = (form.get("email") as string) ?? "";

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Swallow — always show success to avoid email enumeration
    }

    setLoading(false);
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <CHLogo className="h-9 w-auto" />
          <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-inkMuted">
            Admin Panel
          </p>
        </div>

        <div className="rounded-2xl border border-inkBorder bg-white px-8 py-8 shadow-sm">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-display text-xl font-bold text-ink">Check your inbox</h1>
              <p className="mt-2 text-sm text-inkMuted">
                If this email is registered, a reset link has been sent. Check your spam folder if
                you don&apos;t see it within a minute.
              </p>
              <Link
                href="/admin/login"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-terra hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-ink">Forgot password</h1>
              <p className="mt-1 text-sm text-inkMuted">
                Enter your admin email and we&apos;ll send a reset link.
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="admin@chfurniturehouse.com"
                    className="w-full rounded-lg border border-inkBorder bg-white px-4 py-2.5 text-ink placeholder:text-inkMuted/50 transition-colors focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-terra w-full disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-sm text-inkMuted transition-colors hover:text-terra"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
