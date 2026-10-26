"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Boxes, Sofa, MessageSquareQuote,
  Settings as SettingsIcon, Mail, LogOut, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CHLogo } from "@/components/site/CHLogo";

const LINKS = [
  { href: "/admin",            label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories",   icon: Boxes },
  { href: "/admin/furniture",  label: "All Furniture", icon: Sofa },
  { href: "/admin/messages",   label: "Messages",     icon: Mail },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/settings",          label: "Settings",        icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-inkBorder bg-parchment">
      {/* Logo */}
      <div className="border-b border-inkBorder px-6 py-5">
        <Link href="/admin">
          <CHLogo className="h-7 w-auto" />
        </Link>
        <p className="mt-2 text-[10px] font-sans font-medium uppercase tracking-widest text-inkMuted">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {LINKS.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/admin" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                prefetch={true}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-sans font-medium transition-colors duration-150",
                  active
                    ? "bg-blush text-terra"
                    : "text-inkMuted hover:bg-stone hover:text-ink"
                )}
              >
                <l.icon className="h-4 w-4 shrink-0" />
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-inkBorder px-3 py-4">
        <div className="space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-sans font-medium text-inkMuted transition-colors hover:bg-stone hover:text-ink"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            View Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-sans font-medium text-inkMuted transition-colors hover:bg-stone hover:text-red-500"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
