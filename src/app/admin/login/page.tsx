"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { CHLogo } from "@/components/site/CHLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Read ?reset=1 after mount to avoid SSR/hydration mismatch
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("reset") === "1") {
      setResetSuccess(true);
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setResetSuccess(false);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: (form.get("email") as string) ?? "",
      password: (form.get("password") as string) ?? "",
      redirect: false,
    });
    setLoading(false);
    if (!res || res.error) {
      setError("Incorrect email or password.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <CHLogo className="h-9 w-auto" />
          <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-inkMuted">
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-inkBorder bg-white px-8 py-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-inkMuted">Access the dashboard</p>

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

            <div>
              <label className="mb-1.5 block text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
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

            {resetSuccess && (
              <p className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">
                Password updated — please sign in with your new password.
              </p>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-terra w-full disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/admin/forgot-password"
              className="text-sm text-inkMuted transition-colors hover:text-terra"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
