"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { CHLogo } from "@/components/site/CHLogo";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => router.push("/admin/login?reset=1"), 2500);
      return () => clearTimeout(t);
    }
  }, [done, router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const password = (form.get("password") as string) ?? "";
    const confirm = (form.get("confirm") as string) ?? "";

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);

    if (res.ok) {
      setDone(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to reset password. The link may have expired.");
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-600">Invalid or missing reset link.</p>
        <Link
          href="/admin/forgot-password"
          className="mt-4 block text-sm text-terra hover:underline"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
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
        <h2 className="font-display text-xl font-bold text-ink">Password updated!</h2>
        <p className="mt-2 text-sm text-inkMuted">Redirecting you to login…</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-ink">Set new password</h1>
      <p className="mt-1 text-sm text-inkMuted">Choose a strong password — minimum 8 characters.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted">
            New password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-inkBorder bg-white px-4 py-2.5 pr-10 text-ink placeholder:text-inkMuted/50 transition-colors focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra/20"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              tabIndex={-1}
              aria-label={showPass ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-inkMuted transition-colors hover:text-ink"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted">
            Confirm password
          </label>
          <div className="relative">
            <input
              name="confirm"
              type={showConfirm ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-inkBorder bg-white px-4 py-2.5 pr-10 text-ink placeholder:text-inkMuted/50 transition-colors focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-inkMuted transition-colors hover:text-ink"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-terra w-full disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set new password"}
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
  );
}

export default function ResetPasswordPage() {
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
          {/* useSearchParams requires Suspense in the App Router */}
          <Suspense
            fallback={
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-inkMuted" />
              </div>
            }
          >
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
