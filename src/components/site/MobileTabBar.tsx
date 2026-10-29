"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSheet } from "@/context/sheet-context";

type TabItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
};

function TabItem({ href, icon, label, isActive }: TabItemProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] relative px-2"
    >
      {isActive && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-6 rounded-b-full bg-terra" />
      )}
      <span className={cn("h-5 w-5", isActive ? "text-terra" : "text-inkMuted")}>
        {icon}
      </span>
      <span
        className={cn(
          "mt-1 text-[11px] font-sans font-medium leading-none",
          isActive ? "text-terra" : "text-inkMuted"
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();
  const { openWA, lightboxOpen, drawerOpen } = useSheet();

  /* Hide on admin pages */
  if (pathname.startsWith("/admin")) return null;

  /* Hide on product detail pages */
  if (/^\/category\/[^/]+\/[^/]+/.test(pathname)) return null;

  const homeActive = pathname === "/";
  const collectionsActive =
    pathname === "/categories" || pathname.startsWith("/category/");
  const searchActive = pathname === "/search";
  const workshopActive = pathname === "/contact";

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 md:hidden",
        "bg-white/[0.97] backdrop-blur-sm border-t border-inkBorder",
        "shadow-[0_-4px_24px_rgba(0,0,0,0.08)]",
        "transition-transform duration-300",
        (lightboxOpen || drawerOpen) ? "translate-y-full" : "translate-y-0"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16 items-center justify-around px-1">
        {/* Home */}
        <TabItem
          href="/"
          icon={<Home className="h-5 w-5" />}
          label="Home"
          isActive={homeActive}
        />

        {/* Collections */}
        <TabItem
          href="/categories"
          icon={<LayoutGrid className="h-5 w-5" />}
          label="Collections"
          isActive={collectionsActive}
        />

        {/* Center WhatsApp FAB */}
        <div className="relative flex flex-col items-center">
          <button
            onClick={() => openWA()}
            aria-label="Chat on WhatsApp"
            className={cn(
              "absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full",
              "bg-[#25D366] text-white",
              "ring-4 ring-white",
              "shadow-[0_6px_24px_rgba(37,211,102,0.5)]",
              "transition-transform active:scale-95"
            )}
          >
            <MessageCircle className="h-6 w-6" />
          </button>
          {/* Spacer so the row height is maintained */}
          <span className="h-14 w-14" aria-hidden="true" />
        </div>

        {/* Search */}
        <TabItem
          href="/search"
          icon={<Search className="h-5 w-5" />}
          label="Search"
          isActive={searchActive}
        />

        {/* Workshop */}
        <TabItem
          href="/contact"
          icon={<MapPin className="h-5 w-5" />}
          label="Workshop"
          isActive={workshopActive}
        />
      </div>
    </nav>
  );
}
